export interface MenuItem {
  name: string;
  theme: string;
  path: string;
  icon: string;
  childrens: Children[];
}
interface Children {
  name: string;
  link: string;
}
