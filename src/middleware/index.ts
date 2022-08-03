
import { addMiddleware } from "mobx-state-tree";

const rootMiddleware = (rootStore: any) => {

    addMiddleware(rootStore, (call, next, abort) => {
        // debugger;
        if (call.name === "addTodo") {
            // wont be logged and underlying action wont be reached
            abort(call.args[0])
        } else if (call.name === "setUsername") {
            // //console.log("In middleware before modifying addTodo call!");
            next({ ...call, args: [call.args[0]] });
            // //console.log("In middleware after modifying addTodo call!");
        } else {
            next(call);
        }
    });

}

export default rootMiddleware;