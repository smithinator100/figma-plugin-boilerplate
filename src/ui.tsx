import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { AlertCircle, Square, MousePointer } from 'lucide-react';
import './ui.css';

interface SelectionItem {
  id: string;
  name: string;
  type: string;
  width: number | null;
  height: number | null;
}

function App() {
  const [selection, setSelection] = useState<SelectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Handle messages from the plugin code
    window.onmessage = (event) => {
      const { type, data } = event.data.pluginMessage || {};

      switch (type) {
        case 'rectangle-created':
          console.log('Rectangle created:', data);
          // Refresh selection after creating rectangle
          handleGetSelection();
          break;

        case 'selection-data':
          setSelection(data);
          setIsLoading(false);
          break;

        default:
          console.log('Unknown message type:', type);
      }
    };

    // Get initial selection
    handleGetSelection();
  }, []);

  const postMessage = (message: any) => {
    parent.postMessage({ pluginMessage: message }, '*');
  };

  const handleCreateRectangle = () => {
    setIsLoading(true);
    postMessage({ type: 'create-rectangle' });
  };

  const handleGetSelection = () => {
    setIsLoading(true);
    postMessage({ type: 'get-selection' });
  };

  const handleClose = () => {
    postMessage({ type: 'close-plugin' });
  };

  return (
    <div className="p-4 space-y-4 min-h-screen bg-background">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Square className="w-5 h-5" />
            Figma Plugin Boilerplate
          </CardTitle>
          <CardDescription>
            A lightweight starter template for building Figma plugins
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateRectangle} 
              disabled={isLoading}
              className="flex-1"
            >
              Create Rectangle
            </Button>
            <Button 
              variant="outline" 
              onClick={handleGetSelection}
              disabled={isLoading}
            >
              <MousePointer className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Current Selection</h3>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : selection.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                No objects selected
              </div>
            ) : (
              <div className="space-y-2">
                {selection.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.width && item.height && (
                            <span>{item.width} × {item.height}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <Button variant="destructive" onClick={handleClose} className="w-full">
            Close Plugin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Initialize React app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
