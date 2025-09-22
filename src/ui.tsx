import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './components/ui/card';
import { Separator } from './components/ui/separator';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { RectangleHorizontal, MousePointer, X, Palette, Settings } from 'lucide-react';

interface PluginMessage {
  type: 'create-rectangle' | 'get-selection' | 'close-plugin';
  data?: any;
}

interface UIMessage {
  type: 'rectangle-created' | 'selection-data';
  data: any;
}

function App() {
  const [selectionInfo, setSelectionInfo] = useState<string>('Click "Get Selection" to see current selection');
  const [isLoading, setIsLoading] = useState(false);
  const [rectangleName, setRectangleName] = useState('My Rectangle');
  const [rectangleColor, setRectangleColor] = useState('#3b82f6');

  // Handle messages from plugin code
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, data }: UIMessage = event.data.pluginMessage || {};
      
      switch (type) {
        case 'rectangle-created':
          setSelectionInfo(`Rectangle created: ${data.name}`);
          setIsLoading(false);
          break;
        case 'selection-data':
          if (data.length === 0) {
            setSelectionInfo('No objects selected');
          } else {
            setSelectionInfo(`${data.length} object(s) selected: ${data.map((item: any) => `${item.name} (${item.type})`).join(', ')}`);
          }
          setIsLoading(false);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const sendMessage = (message: PluginMessage) => {
    setIsLoading(true);
    parent.postMessage({ pluginMessage: message }, '*');
  };

  const createRectangle = () => {
    sendMessage({ 
      type: 'create-rectangle', 
      data: { 
        name: rectangleName,
        color: rectangleColor 
      } 
    });
  };

  const getSelection = () => {
    sendMessage({ type: 'get-selection' });
  };

  const closePlugin = () => {
    sendMessage({ type: 'close-plugin' });
  };

  return (
    <div className="p-4 w-full min-h-screen bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Figma Plugin Boilerplate
          </CardTitle>
          <CardDescription>
            A modern Figma plugin built with React, TypeScript, and shadcn/ui components.
          </CardDescription>
          <div className="flex gap-2">
            <Badge variant="secondary">
              <Palette className="w-3 h-3 mr-1" />
              shadcn/ui
            </Badge>
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">TypeScript</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="rectangle-name">Rectangle Name</Label>
              <Input
                id="rectangle-name"
                value={rectangleName}
                onChange={(e) => setRectangleName(e.target.value)}
                placeholder="Enter rectangle name"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rectangle-color">Rectangle Color</Label>
              <div className="flex gap-2">
                <Input
                  id="rectangle-color"
                  type="color"
                  value={rectangleColor}
                  onChange={(e) => setRectangleColor(e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                  disabled={isLoading}
                />
                <Input
                  value={rectangleColor}
                  onChange={(e) => setRectangleColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={createRectangle} 
              disabled={isLoading || !rectangleName.trim()}
              className="w-full"
            >
              <RectangleHorizontal className="w-4 h-4 mr-2" />
              Create Rectangle
            </Button>
            
            <Button 
              onClick={getSelection} 
              variant="outline"
              disabled={isLoading}
              className="w-full"
            >
              <MousePointer className="w-4 h-4 mr-2" />
              Get Selection
            </Button>
            
            <Button 
              onClick={closePlugin} 
              variant="destructive"
              disabled={isLoading}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Close Plugin
            </Button>
          </div>
          
          <Separator />
          
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="text-sm">
                <strong className="text-foreground">Selection Info:</strong>
                <div className="mt-1 text-muted-foreground">
                  {isLoading ? 'Loading...' : selectionInfo}
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

// Initialize React app
try {
  console.log('Initializing React app...');
  const container = document.getElementById('root');
  if (container) {
    console.log('Container found, rendering app...');
    const root = createRoot(container);
    root.render(<App />);
    console.log('App rendered successfully!');
  } else {
    console.error('Root container not found');
  }
} catch (error) {
  console.error('Error initializing React app:', error);
}
