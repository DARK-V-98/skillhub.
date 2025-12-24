import React, { useState } from 'react';
import { 
  Settings, 
  Type, 
  Eye, 
  Ear, 
  Hand, 
  Brain,
  Moon,
  Volume2,
  Keyboard,
  RotateCcw,
  X,
  Accessibility
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AccessibilitySettings } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const AccessibilityPanel: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useAccessibility();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="btn-touch-target fixed bottom-6 right-6 z-50 rounded-full shadow-lg border-2 border-primary bg-background hover:bg-accent"
          aria-label="Open Accessibility Settings"
        >
          <Accessibility className="h-6 w-6 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto" side="right">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <Settings className="h-6 w-6 text-primary" />
            Accessibility Settings
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="visual" className="flex flex-col items-center gap-1 py-3 btn-touch-target">
              <Eye className="h-4 w-4" />
              <span className="text-xs">Visual</span>
            </TabsTrigger>
            <TabsTrigger value="hearing" className="flex flex-col items-center gap-1 py-3 btn-touch-target">
              <Ear className="h-4 w-4" />
              <span className="text-xs">Hearing</span>
            </TabsTrigger>
            <TabsTrigger value="motor" className="flex flex-col items-center gap-1 py-3 btn-touch-target">
              <Hand className="h-4 w-4" />
              <span className="text-xs">Motor</span>
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="flex flex-col items-center gap-1 py-3 btn-touch-target">
              <Brain className="h-4 w-4" />
              <span className="text-xs">Cognitive</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base">
                  <Type className="h-4 w-4" />
                  Font Size: {settings.fontSize}px
                </Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                  min={16}
                  max={32}
                  step={2}
                  className="w-full"
                  aria-label="Adjust font size"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>16px</span>
                  <span>32px</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t">
                <Label htmlFor="high-contrast" className="flex items-center gap-2 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  High Contrast Mode
                </Label>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-4 border-t">
                <Label htmlFor="dyslexic-font" className="flex items-center gap-2 cursor-pointer">
                  <Type className="h-4 w-4" />
                  Dyslexia-Friendly Font
                </Label>
                <Switch
                  id="dyslexic-font"
                  checked={settings.dyslexicFont}
                  onCheckedChange={(checked) => updateSettings({ dyslexicFont: checked })}
                />
              </div>

              <div className="space-y-3 py-4 border-t">
                <Label className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Color Blind Filter
                </Label>
                <Select
                  value={settings.colorBlindFilter}
                  onValueChange={(value) => updateSettings({ colorBlindFilter: value as AccessibilitySettings['colorBlindFilter'] })}
                >
                  <SelectTrigger className="btn-touch-target">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                    <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                    <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-4 border-t">
                <Label htmlFor="screen-reader" className="flex items-center gap-2 cursor-pointer">
                  <Eye className="h-4 w-4" />
                  Screen Reader Mode
                </Label>
                <Switch
                  id="screen-reader"
                  checked={settings.screenReader}
                  onCheckedChange={(checked) => updateSettings({ screenReader: checked })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hearing" className="space-y-6">
            <div className="p-4 bg-accent rounded-lg">
              <p className="text-sm text-accent-foreground">
                All video content includes closed captions by default. Sign language interpretation is available on select courses.
              </p>
            </div>

            <div className="flex items-center justify-between py-4 border-t">
              <Label htmlFor="text-to-speech" className="flex items-center gap-2 cursor-pointer">
                <Volume2 className="h-4 w-4" />
                Text-to-Speech
              </Label>
              <Switch
                id="text-to-speech"
                checked={settings.textToSpeech}
                onCheckedChange={(checked) => updateSettings({ textToSpeech: checked })}
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Available Features:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Closed captions on all videos
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Sign language overlay (select courses)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Transcript downloads
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Visual notifications
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="motor" className="space-y-6">
            <div className="flex items-center justify-between py-4">
              <Label htmlFor="keyboard-nav" className="flex items-center gap-2 cursor-pointer">
                <Keyboard className="h-4 w-4" />
                Enhanced Keyboard Navigation
              </Label>
              <Switch
                id="keyboard-nav"
                checked={settings.keyboardNav}
                onCheckedChange={(checked) => updateSettings({ keyboardNav: checked })}
              />
            </div>

            <div className="flex items-center justify-between py-4 border-t">
              <Label htmlFor="reduced-motion" className="flex items-center gap-2 cursor-pointer">
                <Hand className="h-4 w-4" />
                Reduced Motion
              </Label>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
              />
            </div>

            <div className="p-4 bg-accent rounded-lg space-y-2">
              <h4 className="font-medium text-accent-foreground">Motor Accessibility Features:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  All click targets are 44x44px minimum
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  No drag-and-drop required
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Extended timeout periods
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Voice control compatible
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="cognitive" className="space-y-6">
            <div className="p-4 bg-accent rounded-lg space-y-2">
              <h4 className="font-medium text-accent-foreground">Cognitive Support Features:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Simplified UI mode available
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Distraction-free reading mode
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Content summarization
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Built-in dictionary tooltips
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Clear confirmation dialogs
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Progress indicators
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Consistent navigation
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-4 border-t">
          <Button
            variant="outline"
            onClick={resetSettings}
            className="w-full btn-touch-target"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccessibilityPanel;
