export interface GenerateEmailRequest {
  prompt: string;
}

export interface GenerateEmailResponse {
  email: string;
}

export interface SendEmailRequest {
  recipients: string;
  emailBody: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}