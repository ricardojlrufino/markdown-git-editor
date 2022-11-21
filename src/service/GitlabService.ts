import Settings from "./Settings";

interface ResourceInfo {
  host: string;
  groupName: string;
  branch: string;
  repositoryName: string;
  fileName: string;
}

export default class GitlabService {
  
  async uploadImage(resource: string, blob: any): Promise<string> {

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

    const headers: HeadersInit = {
      "private-token": token,
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

  async load(resource: string) {

    console.log("[gitlab] load ", resource);

    let server: string = Settings.get(Settings.GITLAB_HOST);
    let token: string = Settings.get(Settings.GITLAB_TOKEN);
    let info: ResourceInfo = this.detectRepositoryInfo(server+resource);

    console.log("[gitlab] Repository ingo", info);

    let pid = encodeURIComponent(info.groupName + "/" + info.repositoryName);
    let filePath = encodeURIComponent(info.fileName);
    let branch = info.branch;
 
    const headers: HeadersInit = {
      "content-type": "application/json",
      "private-token": token,
    };

    return fetch(server +`/api/v4/projects/${pid}/repository/files/${filePath}/raw?ref=${branch}`,
      {
        method: "GET",
        headers,
      }
    ).then(async (resp:Response) => {

        if(resp.ok){
            return await resp.text();
        }else{
            throw Error(await resp.text());
        }

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
    };

    return info;
  }
}