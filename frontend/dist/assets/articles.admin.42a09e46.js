import{a as x}from"./Sidebar.dccb2f36.js";import{d as _,_ as u,c as e,a as s,F as l,r as d,e as c,o as a,t as A,f as p,g,b as v,p as $,i as w,h as D}from"./index.80d36c9d.js";import{a as P}from"./categories.store.44ebd279.js";const S=_({name:"admin-dashboard",props:{options:{type:Object,default:()=>({itemsPerPage:10})},headers:{type:Array,default:()=>[]},rows:{type:Array,default:()=>[]}}});const C=t=>($("data-v-c2c77d65"),t=t(),w(),t),N={class:"table-responsive"},T={class:""},I=["innerHTML"],V={key:1},B=D("Edit"),L=C(()=>s("div",{style:{display:"flex"}},[s("button",{type:"button",class:"btn btn-pink"},"<Previous"),s("button",{type:"button",class:"btn btn-pink"},"Next>")],-1));function M(t,m,b,h,y,f){const r=c("router-link");return a(),e("div",null,[s("div",N,[s("table",T,[s("thead",null,[s("tr",null,[(a(!0),e(l,null,d(t.headers,(n,i)=>(a(),e("th",{key:i},A(n.title),1))),128))])]),s("tbody",null,[(a(!0),e(l,null,d(t.rows,(n,i)=>(a(),e("tr",{key:i},[(a(!0),e(l,null,d(n,(o,k)=>(a(),e("td",{key:k},[o.action=="text"?(a(),e("span",{key:0,innerHTML:o.title},null,8,I)):o.action=="link"?(a(),e("span",V,[p(r,{to:o.title,class:"btn",type:"button"},{default:g(()=>[B]),_:2},1032,["to"])])):v("",!0)]))),128))]))),128))])]),L])])}const O=u(S,[["render",M],["__scopeId","data-v-c2c77d65"]]),E=P(),F=_({name:"admin-dashboard",components:{adminSidebar:x,Datatable:O},data(){return{articles:[],tableOptions:{headers:[{title:"Title",key:"title",sortable:!0,textAlign:"left"},{title:"Description (short)",key:"description",sortable:!0,textAlign:"left"},{title:"Created At",key:"created_at",sortable:!0,textAlign:"left"},{title:"Updated At",key:"updated_at",sortable:!0,textAlign:"left"},{title:"Actions",key:"actions",sortable:!1,textAlign:"left"}],itemsPerPage:10}}},computed:{displayArticles(){return this.articles.map(t=>[{title:t.name,action:"text"},{title:t.description,action:"text"},{title:t.created_timestamp,action:"text"},{title:t.updated_timestamp,action:"text"},{title:"/admin/articles/edit/"+t.id,action:"link"}]).reverse()}},async beforeMount(){this.articles=await E.getAllPage()}}),H={class:"view"},j=s("h1",null,"Dashboard: Articles",-1);function U(t,m,b,h,y,f){const r=c("admin-sidebar"),n=c("Datatable");return a(),e("div",null,[p(r),s("main",H,[j,p(n,{rows:t.displayArticles,headers:t.tableOptions.headers},null,8,["rows","headers"])])])}const J=u(F,[["render",U]]);export{J as default};
