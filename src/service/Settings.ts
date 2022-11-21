
export default class Settings {
    
    public static readonly GITLAB_HOST = "mkeditor.GITLAB_HOST";
    public static readonly GITLAB_TOKEN = "mkeditor.GITLAB_TOKEN";

    constructor() {
         
    }

    public static get(key:string) : string  {

        let v = localStorage.getItem(key);

        if(!v || v == null) throw Error('key ['+key+'] not found');

        return v;
    }
    
}