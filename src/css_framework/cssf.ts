/* import */
import { select } from "@inquirer/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

/* code */
async function command_cssf() {
    const select_css_framework = await select({
        message: "请选择CSS框架",
        choices: [
            { name: "Bootstrap", value: "bootstrap" },
            { name: "Tailwindcss", value: "tailwindcss" },
        ],
    });

    const select_package_manager = await select({
        message: "请选择包管理器",
        choices: [
            { name: "npm", value: "npm" },
            { name: "pnpm", value: "pnpm" },
            { name: "yarn", value: "yarn" },
        ],
        default: "npm",
    });

    const install_parameter = [
        "tailwindcss",
        "@tailwindcss/postcss",
        "postcss",
        "--force",
    ];
    switch (select_css_framework) {
        case "bootstrap":
            break;
        case "tailwindcss":
            switch (select_package_manager) {
                case "npm":
                    await execa("npm", [
                        "install",
                        "-D",
                        ...install_parameter,
                    ], { stdio: "inherit" });
                    break;
                case "pnpm":
                    await execa("pnpm", [
                        "add",
                        "-D",
                        ...install_parameter,
                    ], { stdio: "inherit" });
                    break;
                case "yarn":
                    await execa("yarn", [
                        "add",
                        "-D",
                        ...install_parameter,
                    ], { stdio: "inherit" });
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }

    create_tailwindcss_file();
    insert_tailwindcss_config();
}

async function create_tailwindcss_file() {
    const content = {
        plugins: {
            "@tailwindcss/postcss": {},
        },
    };

    const filePath = ".postcssrc.json";

    try {
        // 确保文件夹存在（如果需要）
        const dir = filePath.split("/").slice(0, -1).join("/");
        if (dir) {
            await fs.ensureDir(dir);
        }

        // 写入内容
        await fs.writeFile(
            filePath,
            JSON.stringify(content, null, 2),
        );
        console.log(`已创建${filePath}并写入相关配置`);
    } catch (error) {
        console.error("写入文件时出错:", error);
    }
}

async function insert_tailwindcss_config() {
    const css_filepath = path.join(process.cwd(), "\\src\\styles.scss");

    try {
        // 读取文件内容
        let css_file_content = await fs.readFile(css_filepath, "utf8");

        // 检查文件末尾是否有换行
        if (css_file_content.endsWith("\n")) {
            // 如果有换行，直接去掉
            css_file_content = css_file_content.slice(0, -1);
        }

        // 追加内容
        css_file_content += `\n@import "tailwindcss";`;

        // 写回文件
        await fs.writeFile(css_filepath, css_file_content);

        console.log("内容已成功追加到 style.scss 文件末尾");
    } catch (error) {
        console.error("操作失败:", error);
    }
}
/* export */
export default command_cssf;
