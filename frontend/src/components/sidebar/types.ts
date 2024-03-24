export interface MenuItem {
  id: string;
  name: string;
  icon?: string;
  childrens: Children[];
}
interface Children {
  name: string;
  link: string;
}
