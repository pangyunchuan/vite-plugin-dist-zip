import { Plugin } from "vite";
/**
 * 将dist 打包为zip
 * @param zipName 默认值 "dist";  文件名称,不包含后缀名
 * @param zipDir  默认值 ""; 压缩文件存放路径;相对于vite项目根目录;默认空且为空时值为 viteConfig.build.outDir;不会创建目录,请确保目录已存在
 * @param dayjsFormat 默认值 "YYMMDD_HHmm" ; dayjs 日期格式  YYMMDD_HHmm,会拼在压缩包名称上,便于区分压缩包
 * @param includeDistDir 默认值 false ; 为true时  压缩包会包含dist 目录本身,  false 只压缩dist 内容
 */
export default function ({ zipName, zipDir, dayjsFormat, includeDistDir }?: {
    zipName?: string | undefined;
    zipDir?: string | undefined;
    dayjsFormat?: string | undefined;
    includeDistDir?: boolean | undefined;
}): Plugin;
