import React, { createContext, useContext, useState, ReactNode } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Slide, 
  Avatar 
} from "@mui/material";
import { 
  Close, 
  CheckCircle, 
  Error, 
  Warning, 
  Info 
} from "@mui/icons-material";
import { Colors } from "../Consts/Colors";

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {}
});

export const useNotification = (): NotificationContextType => {
  return useContext(NotificationContext);
};

const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (type: NotificationType, title: string, message: string) => {
    const id = Date.now().toString();
    const notification = { id, type, title, message };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <CheckCircle />;
      case 'error': return <Error />;
      case 'warning': return <Warning />;
      default: return <Info />;
    }
  };

  const getColor = (type: NotificationType) => {
    switch (type) {
      case 'success': return Colors.GradientGreen;
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      default: return Colors.GradientBlue;
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
          maxWidth: 320,
        }}
      >
        {notifications.map(notification => (
          <Slide key={notification.id} direction="left" in={true}>
            <Card
              elevation={8}
              sx={{
                borderRadius: 3,
                background: `${getColor(notification.type)}15`,
                border: `1px solid ${getColor(notification.type)}30`,
                mb: 1,
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Avatar
                    sx={{
                      bgcolor: getColor(notification.type),
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getIcon(notification.type)}
                  </Avatar>
                  
                  <Box flexGrow={1}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {notification.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                  </Box>
                  
                  <IconButton
                    size="small"
                    onClick={() => removeNotification(notification.id)}
                    sx={{
                      color: "text.secondary",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Slide>
        ))}
      </Box>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;