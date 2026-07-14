export interface NavigationLink {
  name: string;
  path: string;
}

export interface BespokeService {
  title: string;
  price: string;
  description: string;
  details: string[];
}

export interface AppointmentRequest {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message?: string;
}
