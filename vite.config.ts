import {defineConfig} from 'vite'
import * as path from "path";

const {name} = require("./package.json")

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['dayjs', 'jszip', 'fs', 'path'],
            output: {
                // // // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    "dayjs": "dayjs",
                    "jszip": "jszip"
                }
            },
        },
        lib: {
            entry: path.resolve(__dirname, 'lib/index.ts'),
            name,
            fileName: (format) => `dist.${format}.js`
        }
    }
})
