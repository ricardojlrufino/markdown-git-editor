

export default class Settings {
    
    public static readonly GITLAB_HOST = "mkeditor.GITLAB_HOST";
    public static readonly GITLAB_TOKEN = "mkeditor.GITLAB_TOKEN";
    public static readonly EDITOR_LAST_FILE = "mkeditor.EDITOR_LAST_FILE";
    public static readonly EDITOR_LAST_FILE_DATA = "mkeditor.EDITOR_LAST_FILE_DATA";

    public static readonly EDITOR_MENU_CACHE = "mkeditor.EDITOR_MENU_CACHE";

    constructor() {
         
    }

    public static getSiteSettings() : any  {

        let key = "site-config";

        let v = localStorage.getItem(key);

        if(!v || v == null) throw Error('key ['+key+'] not found');

        return JSON.parse(v);

    }

    public static get(key:string) : string  {

        let v = localStorage.getItem(key);

        if(!v || v == null) throw Error('key ['+key+'] not found');

        return v;
    }


    public static getOpt(key:string, def: string | null) : string  {

        let v = localStorage.getItem(key);

        if(!v || v == null) return def;

        return v;
    }
    
}