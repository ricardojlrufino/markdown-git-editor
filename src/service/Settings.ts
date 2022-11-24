

export default class Settings {
 
    
    public static readonly GITLAB_HOST = "mkeditor.GITLAB_HOST";
    public static readonly GITLAB_TOKEN = "mkeditor.GITLAB_TOKEN";
    public static readonly EDITOR_LAST_FILE = "mkeditor.EDITOR_LAST_FILE";
    public static readonly EDITOR_LAST_FILE_DATA = "mkeditor.EDITOR_LAST_FILE_DATA";

    public static readonly EDITOR_MENU_CACHE = "mkeditor.EDITOR_MENU_CACHE";

    public static readonly AUTH_LOGGED = "mkeditor.AUTH_LOGGED";
    public static readonly AUTH_TOKENS_RESP = "mkeditor.AUTH_TOKENS_RESP";

    constructor() {
         
    }

    public static getSiteSettings() : any  {

        if (window.DocSiteConfig) return window.DocSiteConfig;  // cache

        let key = "site-config";

        let v = localStorage.getItem(key);

        if(!v || v == null) throw Error('key ['+key+'] not found');

        window.DocSiteConfig = JSON.parse(v); // cache

        return window.DocSiteConfig;

    }

    static set(key: string, val: any) {
        
        if(typeof val === 'number' ){
            localStorage.setItem(key, val+"");
        }else if(typeof val === 'string' ){
            localStorage.setItem(key, val);
        }else{
            localStorage.setItem(key, JSON.stringify(val));
        }

    }

    public static get(key:string) : string  {

        let v = localStorage.getItem(key);

        if(!v || v == null) throw Error('key ['+key+'] not found');

        return this._deserialize(v, null);
    }



    public static getOpt(key:string, def: string | null) : any  {

        let v = localStorage.getItem(key);

        if(!v || v == null) return def;

        return this._deserialize(v, def);
    }
    
    public static _deserialize(strVal:string, defaultVal:string) : string  {
        if (!strVal) { return defaultVal }
        // It is possible that a raw string value has been previously stored
        // in a storage without using store.js, meaning it will be a raw
        // string value instead of a JSON serialized string. By defaulting
        // to the raw string value in case of a JSON parse error, we allow
        // for past stored values to be forwards-compatible with store.js
        var val = ''
        try { val = JSON.parse(strVal) }
        catch(e) { val = strVal }

        return (val !== undefined ? val : defaultVal)
    }

    
    public static getBoolean(key:string) : boolean  {

        const stringToBoolean = (stringValue:string) => {
            switch(stringValue?.toLowerCase()?.trim()){
                case "true": 
                case "yes": 
                case "1": 
                  return true;
        
                case "false": 
                case "no": 
                case "0": 
                case null: 
                case undefined:
                  return false;
        
                default: 
                  return JSON.parse(stringValue);
            }
        }

        let v = localStorage.getItem(key);

        if(!v || v == null) return false;

        return stringToBoolean(v);
    }
    
    
}