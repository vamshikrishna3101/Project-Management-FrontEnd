import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

const websocketService = {
  connect: (userEmail, onNotification) => {
    stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        console.log('WebSocket connected');

        // Subscribe to personal notifications
        stompClient.subscribe(`/user/${userEmail}/queue/notifications`, (message) => {
          const notification = JSON.parse(message.body);
          onNotification(notification);
        });
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
      onStompError: (error) => {
        console.error('WebSocket error:', error);
      },
    });

    stompClient.activate();
  },

  subscribeToTask: (taskId, onUpdate) => {
    if (stompClient?.connected) {
      stompClient.subscribe(`/topic/task/${taskId}`, (message) => {
        onUpdate(JSON.parse(message.body));
      });
    }
  },

  subscribeToDashboard: (onUpdate) => {
    if (stompClient?.connected) {
      stompClient.subscribe('/topic/dashboard', (message) => {
        onUpdate(JSON.parse(message.body));
      });
    }
  },

  disconnect: () => {
    if (stompClient) {
      stompClient.deactivate();
      stompClient = null;
    }
  },
};

export default websocketService;