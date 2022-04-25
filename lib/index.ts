import JSZip from "jszip";
import {Plugin, ResolvedConfig} from "vite";

const fs = require('fs')
const path = require('path')

const dayjs = require("dayjs");
const nowDateTime = dayjs();

/**
 * 将dist 打包为zip
 * @param zipName 默认值 "dist";  文件名称,不包含后缀名
 * @param zipDir  默认值 ""; 压缩文件存放路径;相对于vite项目根目录;默认空且为空时值为 viteConfig.build.outDir;不会创建目录,请确保目录已存在
 * @param dayjsFormat 默认值 "YYMMDD_HHmm" ; dayjs 日期格式  YYMMDD_HHmm,会拼在压缩包名称上,便于区分压缩包
 * @param includeDistDir 默认值 false ; 为true时  压缩包会包含dist 目录本身,  false 只压缩dist 内容
 */
export default function (
    {zipName = "dist", zipDir = "", dayjsFormat = "YYMMDD_HHmm",  includeDistDir = false} = {}
): Plugin {
    let viteConfig: ResolvedConfig;
    return <Plugin>{
        name: "vite-plugin-dist-zip",
        apply: "build",
        enforce: "post",
        configResolved(resolvedConfig) {
            // 存储最终解析的配置
            viteConfig = resolvedConfig;
        },
        closeBundle() {
            const distDir = path.resolve(viteConfig.root, viteConfig.build.outDir);
            const zipFullName = `${zipName}_${nowDateTime.format(dayjsFormat)}.zip`;
            const trueZipDir = zipDir ? path.resolve(viteConfig.root, zipDir) : distDir;

            const zip = new JSZip();

            function readDir(jsZip: JSZip, dirPath: string) {
                // 读取dist下的根文件目录
                const files: string[] = fs.readdirSync(dirPath);
                files.forEach(fileName => {
                    const fillPath = path.resolve(dirPath, fileName);
                    const file = fs.statSync(fillPath);
                    // 如果是文件夹的话需要递归遍历下面的子文件
                    if (file.isDirectory()) {
                        const folderZip = jsZip.folder(fileName);
                        if (folderZip) {
                            readDir(folderZip, fillPath);
                        }
                    } else {
                        // 读取每个文件为buffer存到zip中
                        jsZip.file(fileName, fs.readFileSync(fillPath));
                    }
                });
            }

            let folder = null;
            if (includeDistDir) {
                folder = zip.folder(path.basename(distDir))
            }

            readDir(folder || zip, distDir);

            zip.generateAsync({
                type: "nodebuffer", // 压缩类型
                compression: "DEFLATE", // 压缩算法
                compressionOptions: {
                    // 压缩级别
                    level: 9
                }
            }).then(content => {
                const dest = path.resolve(trueZipDir, zipFullName);
                // 把zip包写到硬盘中，这个content现在是一段buffer
                fs.writeFileSync(dest, content);
            });
        }
    };
};
