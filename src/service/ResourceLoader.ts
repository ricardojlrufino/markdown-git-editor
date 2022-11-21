import PreProcessor from "../utils/PreProcessor";
import GitlabService from "./GitlabService";

export default class ResourceLoader {
    
    constructor() {
        
    }

    async uploadImage(resource: string, blob: any): Promise<string>{

        if(resource.startsWith("docs/")){
            throw new Error('Method not implemented.');
        }else{
            return new GitlabService().uploadImage(resource, blob);
        }

    }
   
    async load(resource: string) {

        let resultPr:Promise<string>;

        console.log("teste load", resource); 

        if(resource.startsWith("docs/")){
            resultPr  = fetch("/"+resource).then(async resp => resp.text());
        }else{
            resultPr = new GitlabService().load(resource.substring("/git".length-1));
        }

        return  resultPr.then((text:string) => new PreProcessor().process(text));

    }

}