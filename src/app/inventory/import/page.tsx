'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ImportProductsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file to import');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // In a real app, this would be an API call
      // const response = await fetch('/api/products/import', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // Mock import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results
      const mockResults = {
        totalRows: 150,
        successfulImports: 142,
        failedImports: 8,
        errors: [
          { row: 25, error: 'Invalid price format' },
          { row: 42, error: 'Missing required field: name' },
          { row: 87, error: 'Invalid stock value' },
        ]
      };
      
      setResults(mockResults);
      toast.success(`Import completed! ${mockResults.successfulImports} products imported successfully.`);
    } catch (err: any) {
      setError('Failed to import products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const template = `name,sku,barcode,price,cost,stock,minStock,maxStock,category,description
Wireless Mouse,WM-001,1234567890123,29.99,15.50,45,10,100,Electronics,High-quality wireless mouse
USB Cable,UC-002,1234567890124,12.99,5.25,100,20,200,Accessories,Durable USB cable
Keyboard,KB-003,1234567890125,79.99,35.00,25,15,50,Electronics,Mechanical keyboard`;

    // Create and download file
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Products</h1>
          <p className="text-muted-foreground">
            Upload a CSV file to bulk import products into your inventory.
          </p>
        </div>
        <Button onClick={handleDownloadTemplate}>
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Select a CSV file with your product data to import. Make sure it follows the required format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                CSV files only, maximum 5MB
              </p>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {results && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Import completed successfully!</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Total rows processed: {results.totalRows}</li>
                      <li>Successful imports: {results.successfulImports}</li>
                      <li>Failed imports: {results.failedImports}</li>
                    </ul>
                    {results.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Errors:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {results.errors.map((err: any, index: number) => (
                            <li key={index}>
                              Row {err.row}: {err.error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={handleImport}
                disabled={!file || loading}
              >
                {loading && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-t-transparent" />
                )}
                {loading ? 'Importing...' : 'Import Products'}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/inventory')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Format</CardTitle>
          <CardDescription>
            Required CSV format for product imports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Required Columns</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code>name</code> - Product name (string)</li>
                <li><code>sku</code> - Stock keeping unit (string)</li>
                <li><code>price</code> - Selling price (number)</li>
                <li><code>cost</code> - Cost price (number)</li>
                <li><code>stock</code> - Current stock level (integer)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium">Optional Columns</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li><code>barcode</code> - Product barcode (string)</li>
                <li><code>minStock</code> - Minimum stock level (integer)</li>
                <li><code>maxStock</code> - Maximum stock level (integer)</li>
                <li><code>category</code> - Product category (string)</li>
                <li><code>description</code> - Product description (string)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium">Example Row</h4>
              <pre className="text-sm bg-muted p-2 rounded">
                Wireless Mouse,WM-001,1234567890123,29.99,15.50,45,10,100,Electronics,"High-quality wireless mouse"
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}