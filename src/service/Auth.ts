var REDIRECT_URI = window.location.origin +  window.location.pathname;

import * as oauth from 'oauth4webapi'
import Settings from './Settings';

const SiteConfig = Settings.getSiteSettings();

export default class Auth {

    constructor() {
        
    }

    static  isEnabled(){
      return SiteConfig["auth"]["enabled"] == "true";
    }

    static isLogged(){
        return Settings.getBoolean(Settings.AUTH_LOGGED);
    }

    static async handleAuth(){

      if(this.isEnabled() && !this.isLogged()){

        // check oauth code in URL
        const url = window.location.href;
        if (url.includes("?code=")) {
  
          Auth.afterlogin();

       

        }else{
 
          Auth.login(); // will redirect to oauth provider site

        }

      }else{}

    }

    /**
     * After Oauth redirect with code in URL.
     */
    static async afterlogin(){

      const code_verifier = 'code_challenge';

      const issuer = new URL(SiteConfig["auth"]["baseUrl"]);

      const as = await oauth
        .discoveryRequest(issuer)
        .then((response:any) => oauth.processDiscoveryResponse(issuer, response))

      const client: oauth.Client = {
        client_id: SiteConfig["auth"]["clientID"],
        client_secret: SiteConfig["auth"]["secret"],
        token_endpoint_auth_method: 'client_secret_basic',
      }

      // one eternity later, the user lands back on the redirect_uri
      {
        const currentUrl: URL = new URL(window.location.href);
      
        const parameters = oauth.validateAuthResponse(as, client, currentUrl, oauth.expectNoState)
        if (oauth.isOAuth2Error(parameters)) {
          console.log('error', parameters)
          throw new Error() // Handle OAuth 2.0 redirect error
        }

        const response = await oauth.authorizationCodeGrantRequest(
          as,
          client,
          parameters,
          REDIRECT_URI,
          code_verifier,
        )

        let challenges: oauth.WWWAuthenticateChallenge[] | undefined
        if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
          for (const challenge of challenges) {
            console.log('challenge', challenge)
          }
          throw new Error() // Handle www-authenticate challenges as needed
        }

        const result = await oauth.processAuthorizationCodeOAuth2Response(as, client, response)
        
        
        if (oauth.isOAuth2Error(result)) {
          console.log('error', result)
          throw new Error() // Handle OAuth 2.0 response body error
        }

        console.log('result', result)

        Settings.set(Settings.AUTH_LOGGED, "true");

        Settings.set(Settings.AUTH_TOKENS_RESP, result);

        Settings.set(Settings.GITLAB_TOKEN, result["access_token"]);
        Settings.set(Settings.GITLAB_HOST, SiteConfig["auth"]["baseUrl"]);

        // remove code from url history
        const newUrl = window.location.href.split("?code=");
        window.history.pushState({}, null, newUrl[0]);

      }

    }

    /**
     * Start login flow
     */
    static async login(){

      const issuer = new URL(SiteConfig["auth"]["baseUrl"]);

      const as = await oauth
        .discoveryRequest(issuer)
        .then((response: any) =>
          oauth.processDiscoveryResponse(issuer, response)
        );

      const client: oauth.Client = {
        client_id: SiteConfig["auth"]["clientID"],
        client_secret: SiteConfig["auth"]["secret"],
        token_endpoint_auth_method: "client_secret_basic",
      };

      // const code_verifier = oauth.generateRandomCodeVerifier();
      // const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);
      // const code_challenge_method = "S256";

      {
        // redirect user to as.authorization_endpoint

        const authorizationUrl = new URL(as.authorization_endpoint!);
        authorizationUrl.searchParams.set("client_id", client.client_id);

        // authorizationUrl.searchParams.set('code_challenge', code_challenge)
        // authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method)

        authorizationUrl.searchParams.set("code_challenge", "code_challenge");
        authorizationUrl.searchParams.set("code_challenge_method", "plain");

        authorizationUrl.searchParams.set("redirect_uri", REDIRECT_URI);
        authorizationUrl.searchParams.set("response_type", "code");
        authorizationUrl.searchParams.set("scope", "api read_repository write_repository");

        window.location.href = authorizationUrl.href;
      }

    }

    static async refreshToken(){

      const issuer = new URL(SiteConfig["auth"]["baseUrl"]);

      const storedTokens:any = Settings.get(Settings.AUTH_TOKENS_RESP);
      const refreshToken = storedTokens["refresh_token"];

      if(!refreshToken){
        console.warn("Refresh token not found !!");
        Settings.set(Settings.AUTH_LOGGED, false);
        await this.login();
        return;
      }

      debugger;

      const as = await oauth
        .discoveryRequest(issuer)
        .then((response:any) => oauth.processDiscoveryResponse(issuer, response))

      const client: oauth.Client = {
        client_id: SiteConfig["auth"]["clientID"],
        client_secret: SiteConfig["auth"]["secret"],
        token_endpoint_auth_method: 'client_secret_basic',
      }

      return oauth.refreshTokenGrantRequest(
        as,
        client,
        refreshToken,
      ).then(async resp => {

        if(resp.ok){

          let tokens = await resp.json();
      
          Settings.set(Settings.AUTH_LOGGED, "true");
          Settings.set(Settings.AUTH_TOKENS_RESP, tokens);
          Settings.set(Settings.GITLAB_TOKEN, tokens["access_token"]);

        }else{
          console.error(resp);
          throw new Error("Falied to refresh token");
        }

      })
   
    }
}