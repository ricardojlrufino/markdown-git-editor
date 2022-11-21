import GitlabService from "./GitlabService";

export default class ResourceLoaderFactory {
    
    constructor() {
        
    }

    getResourceProvider(){
        // TODO: Make singleton
        // TODO: Check enviroment variables or localStorage
        return new GitlabService();
    }

}