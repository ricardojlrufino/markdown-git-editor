import PreProcessor from "../utils/PreProcessor";
import GitlabService from "./GitlabService";
import ResourceLoaderFactory from "./ResourceLoaderFactory";

export interface LinkInfo {
    internal: boolean;
    linkRel: string;
}

export default class ResourceLoader {

    resourceProvider : GitlabService;
    
    constructor() {

        this.resourceProvider =  new ResourceLoaderFactory().getResourceProvider();
        
    }

    // TODO: Create new class: ResourceLoaderFactory, to return GitlabService

    async uploadImage(resource: string, blob: any): Promise<string>{

        if(resource.startsWith("docs/")){
            throw new Error('Method not implemented.');
        }else{
            return new GitlabService().uploadImage(resource, blob);
        }

    }

    resolveLink(link:string, currentResource: string): LinkInfo {
      
        return this.resourceProvider.resolveLink(link, currentResource.substring("/git".length-1));

    }

    resolveImageRelative(imagePath:string, toResource: string): string {

        if(toResource.startsWith("docs/")){
            return imagePath;
        }else if(toResource.startsWith("http")){
            return imagePath;
        }else{
            return new GitlabService().resolveImageRelative(imagePath, toResource.substring("/git".length-1));
        }

    }
   
    async load(resource: string) {

        let resultPr:Promise<string>;

        if(resource.startsWith("docs/")){
            resultPr  = fetch("/"+resource).then(async resp => resp.text());
        }else{
            resultPr = new GitlabService().load(resource.substring("/git".length-1));
        }

        return  resultPr.then((text:string) => new PreProcessor().process(text));

    }

}