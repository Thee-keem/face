import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ReportStatus } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

interface CustomSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
  };
  expires: string;
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can trigger report generation
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const { scheduledReportId } = body;
    
    // Validate input
    if (!scheduledReportId) {
      return NextResponse.json({ error: 'scheduledReportId is required' }, { status: 400 });
    }
    
    // Get scheduled report
    const scheduledReport = await db.scheduledReport.findUnique({
      where: { id: scheduledReportId },
    });
    
    if (!scheduledReport) {
      return NextResponse.json({ error: 'Scheduled report not found' }, { status: 404 });
    }
    
    // Create report history entry
    const reportHistory = await db.reportScheduleHistory.create({
      data: {
        scheduledReportId: scheduledReport.id,
        status: ReportStatus.PENDING,
      },
    });
    
    try {
      // Update status to processing
      await db.reportScheduleHistory.update({
        where: { id: reportHistory.id },
        data: { status: ReportStatus.PROCESSING },
      });
      
      // Generate report (this would be a more complex process in a real implementation)
      // For now, we'll simulate report generation
      const reportPath = `/reports/${scheduledReport.reportType}_${new Date().getTime()}.pdf`;
      
      // In a real implementation, you would:
      // 1. Generate the report data
      // 2. Create the report file (PDF, CSV, etc.)
      // 3. Save the file to storage
      // 4. Update the history with the file path
      
      // Simulate report generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update status to completed
      await db.reportScheduleHistory.update({
        where: { id: reportHistory.id },
        data: {
          status: ReportStatus.COMPLETED,
          filePath: reportPath,
        },
      });
      
      // Update next run time for the scheduled report
      let nextRunAt: Date | null = null;
      const now = new Date();
      
      switch (scheduledReport.frequency) {
        case 'DAILY':
          nextRunAt = new Date(now.setDate(now.getDate() + 1));
          break;
        case 'WEEKLY':
          nextRunAt = new Date(now.setDate(now.getDate() + 7));
          break;
        case 'MONTHLY':
          nextRunAt = new Date(now.setMonth(now.getMonth() + 1));
          break;
      }
      
      if (nextRunAt) {
        await db.scheduledReport.update({
          where: { id: scheduledReport.id },
          data: { nextRunAt },
        });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Report generated successfully',
        reportPath,
        historyId: reportHistory.id,
      });
      
    } catch (error) {
      // Update status to failed
      await db.reportScheduleHistory.update({
        where: { id: reportHistory.id },
        data: {
          status: ReportStatus.FAILED,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      
      throw error;
    }
    
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

// Endpoint to trigger all due scheduled reports
export async function PUT(request: Request) {
  try {
    // This endpoint can be called by a cron job or background process
    // Check authentication (this could be a service token in a real implementation)
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can trigger scheduled reports
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get all active scheduled reports that are due
    const now = new Date();
    const dueReports = await db.scheduledReport.findMany({
      where: {
        isActive: true,
        nextRunAt: {
          lte: now,
        },
      },
    });
    
    const results: any[] = [];
    
    // Process each due report
    for (const report of dueReports) {
      try {
        // Create report history entry
        const reportHistory = await db.reportScheduleHistory.create({
          data: {
            scheduledReportId: report.id,
            status: ReportStatus.PENDING,
          },
        });
        
        // Update status to processing
        await db.reportScheduleHistory.update({
          where: { id: reportHistory.id },
          data: { status: ReportStatus.PROCESSING },
        });
        
        // Generate report (simulation)
        const reportPath = `/reports/${report.reportType}_${new Date().getTime()}.pdf`;
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update status to completed
        await db.reportScheduleHistory.update({
          where: { id: reportHistory.id },
          data: {
            status: ReportStatus.COMPLETED,
            filePath: reportPath,
          },
        });
        
        // Update next run time
        let nextRunAt: Date | null = null;
        
        switch (report.frequency) {
          case 'DAILY':
            nextRunAt = new Date(now.setDate(now.getDate() + 1));
            break;
          case 'WEEKLY':
            nextRunAt = new Date(now.setDate(now.getDate() + 7));
            break;
          case 'MONTHLY':
            nextRunAt = new Date(now.setMonth(now.getMonth() + 1));
            break;
        }
        
        if (nextRunAt) {
          await db.scheduledReport.update({
            where: { id: report.id },
            data: { nextRunAt },
          });
        }
        
        results.push({
          reportId: report.id,
          status: 'success',
          historyId: reportHistory.id,
        });
        
      } catch (error) {
        console.error(`Error generating report ${report.id}:`, error);
        
        // Create failed history entry
        await db.reportScheduleHistory.create({
          data: {
            scheduledReportId: report.id,
            status: ReportStatus.FAILED,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        
        results.push({
          reportId: report.id,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Processed ${dueReports.length} scheduled reports`,
      results,
    });
    
  } catch (error) {
    console.error('Error processing scheduled reports:', error);
    return NextResponse.json({ error: 'Failed to process scheduled reports' }, { status: 500 });
  }
}