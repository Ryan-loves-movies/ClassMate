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
