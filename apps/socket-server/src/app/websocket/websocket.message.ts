type WebsocketMessage = {
  event: string;
  success: boolean;
  message: string;
  data?: any;
};

export default WebsocketMessage;