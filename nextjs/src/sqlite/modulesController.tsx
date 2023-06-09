import axios, { AxiosError, AxiosResponse } from "axios";
import modules from "@/sqlite/modulesModel";

interface ModuleResponse {
    moduleCode: string;
    title: string;
    semesters: number[];
}

interface Module {
    code: string;
    title: string;
}

export default async function populateDatabase() {
    await modules.sync();
    // Fetch module list data from NUSMods API
    await axios.get<ModuleResponse[]>('https://api.nusmods.com/v2/2022-2023/moduleList.json')
        .then((res: AxiosResponse) => {
            res.data
                .filter((module: ModuleResponse) => module.moduleCode !== null)
                .map((module: ModuleResponse) => ({
                    code: module.moduleCode,
                    title: module.title
                }))
                .forEach((module: Module, index: number) => {
                    if ((index + 1) % 1000 === 0) {
                        console.log("Another 1000 records updated");
                    }
                    modules.create(module, { ignoreDuplicates: true })
                        .then(() => { });
                })
                .all();
            // const lol = {
            //         code: res.data[0].moduleCode,
            //         title: res.data[0].title
            //     };
            // modules.create(lol, { ignoreDuplicates: true })
            // .then(() => console.log("ok"));
            //     fields: ['code', 'title'],
            //     ignoreDuplicates: true,
            //     logging: console.log
            // });
            // console.log(acceptedModules[0].moduleCode);
            // acceptedModules = {
            //     code: acceptedModules[0].moduleCode,
            //     title: acceptedModules[0].title
            // };
            // Insert module data into the database
        })
        .catch((err: AxiosError) => {
            console.error('Error populating database:', err.message);
        });
}

async function queryDatabase() {
    const lol = await modules.findOne({ where: { code: "BT1101" } });
    // const lol = await modules.findAll();
    console.log(lol);
}

// populateDatabase();
queryDatabase();
