'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';

export default function WebSocketConnectionTest() {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for connection events
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setMessages(prev => [...prev, 'Connected to WebSocket server']);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setMessages(prev => [...prev, 'Disconnected from WebSocket server']);
    });

    // Listen for messages
    socket.on('message', (data: any) => {
      console.log('Received message:', data);
      setMessages(prev => [...prev, `Message: ${data.text}`]);
    });

    // Clean up listeners
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (socket) {
      socket.emit('message', {
        text: 'Hello from client!',
        senderId: 'client-test',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">WebSocket Connection Test</h1>
          <p className="text-muted-foreground">
            Test the WebSocket connection to the server
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>
              Current WebSocket connection status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? 'default' : 'destructive'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              <span>
                {isConnected ? 'Connected to WebSocket server' : 'Not connected to WebSocket server'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>
              Send test messages to the server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSendMessage}
              disabled={!isConnected}
            >
              Send Test Message
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>
              Messages received from the server
            </CardDescription>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No messages received yet
              </p>
            ) : (
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className="p-3 border rounded-md bg-muted/50"
                  >
                    {message}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}