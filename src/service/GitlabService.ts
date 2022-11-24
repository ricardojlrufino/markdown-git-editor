import { LinkInfo } from "./ResourceLoader";
import Settings from "./Settings";
import { configureRefreshFetch, fetchJSON } from 'refresh-fetch'
import * as _ from 'lodash';    

import Auth from "./Auth";

interface ResourceInfo {
  host: string;
  groupName: string;
  branch: string;
  repositoryName: string;
  fileName: string; // ex: folder/subolder/file.ext
  folderName: string; 
}

const fetchInterceptor = (url:string, options = {}) => {
  let token: string = Settings.get(Settings.GITLAB_TOKEN);

  let optionsWithToken = options
  if (token != null) {
    optionsWithToken = _.merge({}, options, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  return fetchJSON(url, optionsWithToken)
}

const apiFetch = configureRefreshFetch({

  // Pass fetch function you want to wrap, it should already be adding
  // token to the request
  fetch : fetchInterceptor,

  // shouldRefreshToken is called when API fetch fails and it should decide
  // whether the response error means we need to refresh token
  shouldRefreshToken: (error:any) => {
    debugger;
    return error.response.status === 401 && error.body.error === "invalid_token"
  },

  // refreshToken should call the refresh token API, save the refreshed
  // token and return promise -- resolving it when everything goes fine,
  // rejecting it when refreshing fails for some reason
  refreshToken: async () => {
    debugger;
    return Auth.refreshToken();
  }
})



export default class GitlabService {

  resolveLink(link: string, currentResource: string): LinkInfo {

    if(!currentResource.startsWith("/")) currentResource = "/" + currentResource;

    let server: string = Settings.get(Settings.GITLAB_HOST);
    let info: ResourceInfo = this.detectRepositoryInfo(server+currentResource);

    if(link.startsWith(server)){ // full link to internal resource
      return {
        internal : true,
        linkRel : link.substring(server.length)
      };
    }else if(link.startsWith("./")){ // same path
      return {
        internal : true,
        linkRel : "/"+info.groupName + "/" + info.repositoryName + "/-/blob/" + info.branch + "/" + info.folderName + "/" + link.substring(2)
      }
    }else{
      return {
        internal : false,
        linkRel : link
      }
    }

  }


  resolveImageRelative(imagePath:string, toResource: string): string {
    
    if(!toResource.startsWith("/")) toResource = "/" + toResource;

    let server: string = Settings.get(Settings.GITLAB_HOST);
    let token: string = Settings.get(Settings.GITLAB_TOKEN);
    let info: ResourceInfo = this.detectRepositoryInfo(server+toResource);

    // Ex.: https://gitlab.com/vip51/roteiros/publico/-/raw/feature-testes/subpasta/icon_android.png

    return server + "/" + info.groupName + "/" + info.repositoryName + "/-/raw/" + info.branch + "/" + info.folderName + "/" + imagePath;
  }
  
  async uploadImage(resource: string, blob: any): Promise<string> {

    if(!resource.startsWith("/")) resource = "/" + resource;

    let server: string = Settings.get(Settings.GITLAB_HOST);
    let token: string = Settings.get(Settings.GITLAB_TOKEN);
    let info: ResourceInfo = this.detectRepositoryInfo(server+resource);

    let pid = encodeURIComponent(info.groupName + "/" + info.repositoryName);


    // https://github.com/hometlt/png-metadata
   

    function readAsDataURL(blob:any)  {
      return new Promise((resolve, reject) => {
          const fr = new FileReader();
          fr.onerror = reject;
          fr.onload = () => {
              resolve(fr.result);
          }
          fr.readAsDataURL(blob);
      });
    }


    let data = new FormData();
    data.append('file',blob);

    // const headers: HeadersInit = {
    //   "private-token": token,
    // };

    const headers: HeadersInit = {
      "Authorization": "Bearer " + token,
    };

    return fetch(server + `/api/v4/projects/${pid}/uploads`, {
      method: 'POST',
      headers: headers,
      body: data
    }).then(async (resp:Response) => {
      console.log(resp);
      if(resp.ok){
          return (await resp.json())["full_path"];
      }else{
          throw Error(await resp.text());
      }
    });

    //var data:string = await readAsDataURL(blob);
    // Get only data part
    //var data64 = data.substring("data:image/png;base64,".length);

    return Promise.resolve("mu promisse");

  }

  async refrestToken(afterRefreshCallback:Function) {

    console.log("refrestToken ");

    afterRefreshCallback();

  }

  async load(resource: string) {

    if(!resource.startsWith("/")) resource = "/" + resource;

    console.log("[gitlab] load ", resource);

    let server: string = Settings.get(Settings.GITLAB_HOST);
    let token: string = Settings.get(Settings.GITLAB_TOKEN);
    let info: ResourceInfo = this.detectRepositoryInfo(server+resource);

    console.log("[gitlab] Repository info", info);

    let pid = encodeURIComponent(info.groupName + "/" + info.repositoryName);
    let filePath = encodeURIComponent(info.fileName);
    let branch = info.branch;
 
    const headers: HeadersInit = {
      "Authorization": "Bearer " + token,
      "content-type": "application/json",
    };

    return apiFetch(server +`/api/v4/projects/${pid}/repository/files/${filePath}/raw?ref=${branch}`,
      {
        method: "GET",
        headers,
      }
    ).then(async (resp:Response) => {

      return resp.body;


    });
  }


  async save(resource: string, content: string, message:string,  newbranch: string | null) : Promise<string>{

    if(!resource.startsWith("/")) resource = "/" + resource;

    let server: string = Settings.get(Settings.GITLAB_HOST);
    let token: string = Settings.get(Settings.GITLAB_TOKEN);
    let info: ResourceInfo = this.detectRepositoryInfo(server+resource);

    let pid = encodeURIComponent(info.groupName + "/" + info.repositoryName);
    let filePath = encodeURIComponent(info.fileName);

    // create branche ?
    if(newbranch && newbranch != info.branch){
       await this.newBranch(newbranch, resource);
    }

    let branch = (newbranch ? newbranch :  info.branch);

    return apiFetch(server + `/api/v4/projects/${pid}/repository/files/${filePath}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({
        "branch": branch,
        "commit_message": message,
        "content": content
      })
    }).then((resp:any) => {
        return info.groupName + "/" + info.repositoryName + "/-/blob/" + branch + "/" + info.fileName;
    });
  }

  async newBranch(newbranch: string, resourceRef:string) {

    if(!resourceRef.startsWith("/")) resourceRef = "/" + resourceRef;

    console.log("Creating branche...");

    let server: string = Settings.get(Settings.GITLAB_HOST);
    let token: string = Settings.get(Settings.GITLAB_TOKEN);
    let info: ResourceInfo = this.detectRepositoryInfo(server+resourceRef);

    let pid = encodeURIComponent(info.groupName + "/" + info.repositoryName);
    let branchRef = info.branch;

    return fetch(server + `/api/v4/projects/${pid}/repository/branches`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify({
        "branch": newbranch,
        "ref": branchRef
      })
    }).then(resp => {

      return true;

    });

  }

  detectRepositoryInfo(url: string): ResourceInfo {
    var schema = url.substring(0, url.indexOf("://") + 3);

    var tmp = url.substring(schema.length);

    var host = schema + tmp.substring(0, tmp.indexOf("/"));

    const SEP = url.indexOf("/raw/") > 0 ? "/-/raw/" : "/-/blob/";

    // branche / filePath
    tmp = tmp.substring(tmp.indexOf(SEP) + SEP.length);

    var branch = tmp.substring(0, tmp.indexOf("/"));
    var file = tmp.substring(branch.length + 1);

    var folder = file.substring(0, file.lastIndexOf("/"));

    // Frist path (http://host/group/repository)
    tmp = url.substring(0, url.indexOf(SEP));

    var repostory = tmp.substring(tmp.lastIndexOf("/") + 1);
    var group = url.substring(
      host.length + 1,
      url.indexOf(SEP) - repostory.length - 1
    );

    var info: ResourceInfo = {
      host: host,
      groupName: group,
      branch: branch,
      repositoryName: repostory,
      fileName: file,
      folderName: folder,
    };

    return info;
  }
}