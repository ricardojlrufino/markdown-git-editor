import { pipe } from "./Pipe";


//  hot-reload handler
export const count = 1        
if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
        if (newModule) {
        // newModule is undefined when SyntaxError happened
            console.log('updated: count is now ', newModule.count)
            window.location.reload();
        }
    })
}

export default class PreProcessor {

    tasks: Function[] = [];
    
    constructor() {

    }

    process(text:string){

        // trasform native markdown to tui-editor block extension
        const mermaid = (text:string) => {
            const rule = /```mermaid\n([\s\S]*?)```/g;
            const target = "$$$$mermaid\n$1$$$$\n";
            return text.replaceAll(rule, target);
        };

        const plantuml = (text:string) => {
            const rule = /```plantuml\n([\s\S]*?)```/g;
            const target = "$$$$plantuml\n$1$$$$\n";
            return text.replaceAll(rule, target);
        };

        const uml = (text:string) => {
            const rule = /```uml\n([\s\S]*?)```/g;
            const target = "$$$$uml\n$1$$$$\n";
            return text.replaceAll(rule, target);
        };
    
        let textPipeline = pipe(mermaid, plantuml, uml);

        //return  text;
        return  textPipeline(text);
    }
}