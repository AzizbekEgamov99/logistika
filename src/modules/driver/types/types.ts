export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  description?: string;
  children?: MenuItem[];
  onClick?: () => void;
}