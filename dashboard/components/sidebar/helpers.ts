import { ref } from 'vue';

export const isOpened = ref(false);
export const hasSidebar = ref(false);
export const paneWidth = ref(335); // initial width of pane 1
export interface Item {
  id: string;
  title: string;
  icon?: string;
  route: string;
  childrens: Item[];
}

export const defaultItems: Item[] = [
  {
    id: '#1',
    title: 'Navigattion',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M320-160q-117 0-198.5-81.5T40-440q0-107 70.5-186.5T287-718l-63-66 56-56 160 160-160 160-56-57 59-59q-71 14-117 69t-46 127q0 83 58.5 141.5T320-240h120v80H320Zm200-360v-280h360v280H520Zm0 360v-280h360v280H520Zm80-80h200v-120H600v120Z"/></svg>',
    route: '/dashboard/scategory&ettings',
    childrens: [
      {
        id: 'manage-categories',
        title: 'Manage categories',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M320-320h480v-480h-80v280l-100-60-100 60v-280H320v480Zm0 80q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm360-720h200-200Zm-200 0h480-480Z"/></svg>',
        route: '/dashboard/categories',
        childrens: [],
      },
      {
        id: 'cdn',
        title: 'CDN',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M485-440h163q26 0 44-18t18-44q0-26-18-44.5T648-565h-2q-5-32-29-53.5T560-640q-26 0-47 13.5T481-590q-30 2-50.5 23.5T410-515q0 30 21.5 52.5T485-440ZM120-120q-33 0-56.5-23.5T40-200v-520h80v520h680v80H120Zm160-160q-33 0-56.5-23.5T200-360v-440q0-33 23.5-56.5T280-880h200l80 80h280q33 0 56.5 23.5T920-720v360q0 33-23.5 56.5T840-280H280Zm0-80h560v-360H527l-80-80H280v440Zm0 0v-440 440Z"/></svg>',
        route: '/dashboard/cdn',
        childrens: [],
      },
      {
        id: 'backup',
        title: 'Backup',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q17-72 85-137t145-65q33 0 56.5 23.5T520-716v242l64-62 56 56-160 160-160-160 56-56 64 62v-242q-76 14-118 73.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-48-22-89.5T600-680v-93q74 35 117 103.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm220-358Z"/></svg>',
        route: '/dashboard/backup',
        childrens: [],
      },
      {
        id: 'new-page',
        title: 'New page',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>',
        route: '/dashboard/new',
        childrens: [],
      },
    ],
  },
];
