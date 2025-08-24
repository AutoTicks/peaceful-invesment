import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Instagram, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SocialShareProps {
  referralLink: string;
  referralCode: string;
}

const SocialShare = ({ referralLink, referralCode }: SocialShareProps) => {
  const shareMessage = `🚀 Join me on this amazing trading platform! I've been using it and thought you might be interested. Use my referral code ${referralCode} to get started!`;
  
  const shareTemplates = {
    twitter: `🚀 Just discovered an amazing trading platform! Join me and let's grow our portfolios together 📈\n\nUse code: ${referralCode}\n${referralLink}\n\n#Trading #Investment #FinTech`,
    
    facebook: `Hey friends! 👋\n\nI've been using this incredible trading platform and wanted to share it with you. The features are amazing and I think you'd love it too!\n\nUse my referral code: ${referralCode}\n${referralLink}`,
    
    linkedin: `Professional traders! 📊\n\nI've found a platform that's been instrumental in my trading journey. The tools and features are top-notch for both beginners and experienced traders.\n\nInterested? Use code: ${referralCode}\n${referralLink}\n\n#Trading #FinTech #Investment`,
    
    whatsapp: `Hi! 👋 I've been using this amazing trading platform and thought you might be interested. Check it out using my code: ${referralCode} 🚀\n\n${referralLink}`,
    
    email: {
      subject: `Join me on this amazing trading platform!`,
      body: `Hi there!\n\nI hope you're doing well! I wanted to share something exciting with you.\n\nI've been using this incredible trading platform and I think you'd really benefit from it too. The interface is user-friendly, the tools are powerful, and the community is fantastic.\n\nIf you're interested in checking it out, you can use my referral code: ${referralCode}\n\nHere's the link: ${referralLink}\n\nLet me know if you have any questions!\n\nBest regards`
    }
  };

  const handleSocialShare = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTemplates.twitter)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(shareTemplates.facebook)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}&summary=${encodeURIComponent(shareTemplates.linkedin)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareTemplates.whatsapp)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(shareTemplates.email.subject)}&body=${encodeURIComponent(shareTemplates.email.body)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const copyTemplate = async (template: string) => {
    try {
      await navigator.clipboard.writeText(template);
      toast({
        title: "Copied!",
        description: "Message template copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy template",
        variant: "destructive",
      });
    }
  };

  const socialPlatforms = [
    { 
      name: 'Twitter', 
      icon: Twitter, 
      color: 'hover:bg-blue-50 hover:text-blue-600',
      platform: 'twitter'
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'hover:bg-blue-50 hover:text-blue-700',
      platform: 'facebook'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      color: 'hover:bg-blue-50 hover:text-blue-800',
      platform: 'linkedin'
    },
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'hover:bg-green-50 hover:text-green-600',
      platform: 'whatsapp'
    },
    { 
      name: 'Email', 
      icon: Instagram, 
      color: 'hover:bg-purple-50 hover:text-purple-600',
      platform: 'email'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Social Media Sharing
        </CardTitle>
        <CardDescription>
          Share your referral link across different platforms to maximize reach
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Share Buttons */}
        <div>
          <h4 className="font-medium mb-3">Quick Share</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {socialPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <Button
                  key={platform.name}
                  variant="outline"
                  className={`flex flex-col items-center gap-2 h-auto py-3 ${platform.color}`}
                  onClick={() => handleSocialShare(platform.platform)}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs">{platform.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Message Templates */}
        <div>
          <h4 className="font-medium mb-3">Pre-written Templates</h4>
          <div className="space-y-3">
            {Object.entries(shareTemplates).map(([platform, template]) => {
              if (platform === 'email') return null; // Skip email as it's handled differently
              
              return (
                <div key={platform} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="capitalize">
                      {platform}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyTemplate(template as string)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {template as string}
                  </p>
                </div>
              );
            })}
            
            {/* Email Template */}
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">Email</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyTemplate(`Subject: ${shareTemplates.email.subject}\n\n${shareTemplates.email.body}`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Subject:</strong> {shareTemplates.email.subject}</p>
                <p className="line-clamp-3">{shareTemplates.email.body}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">💡 Sharing Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Personalize your messages to increase engagement</li>
            <li>• Share success stories and experiences</li>
            <li>• Post during peak hours for maximum visibility</li>
            <li>• Use relevant hashtags to reach broader audiences</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialShare;