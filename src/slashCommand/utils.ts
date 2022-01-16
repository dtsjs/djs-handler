import { Command } from './handler.interfaces';
class Utils {
    static fixCommand(command: Command) {

        const cmd:any = command;

        cmd.name.replace(/\s/g, '-');
        cmd.name = cmd.name.toLowerCase();


        if (cmd.options) {
            const options: any[] = [];
            Object.keys(cmd.options).forEach(key => {
                let type: number;
                if (key === 'string') type = 3
                else if (key === 'user') type = 6
                else if (key === 'channel') type = 7
                else if (key === 'role') type = 8
                else if (key === 'boolean') type = 5
                else if (key === 'integer') type = 4

                if(key === 'string'){
                    cmd.options[key].forEach((option: { choices: any; name: string; }) => {
                        if(option.choices) {
                            option.choices.push({
                                ...option.choices,
                                name: option.name.replace(/\s/g, '-')
                            })
                        }
                    })
                }


                cmd.options[key].forEach((option: any) => {
                    options.push({
                        ...option,
                        type: type
                    })
                })
            })
            cmd.options = options;

            cmd.options.sort((a: { required: any; }, b: { required: any; }) => {
                if (a.required && !b.required) return -1;
                if (!a.required && b.required) return 1;
                return 0;
            })
        }

        return cmd;
    }
}

export default Utils;