# 学習メモ

## tsconfig.json
### baseUrl
モジュールのインポートやパス解決の際の基準となるベースディレクトリを指定。  
これによりモジュールのパスを簡潔に記載できる。  

### paths
モジュール解決時に使用されるエイリアス（パスの別名）を指定。  
baseUrlと併用して、baseUrl の基準に対して相対的なエイリアスを指定する使い方もある。  
```sample.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```

### next.config.js
Next.jsプロジェクトの設定を行うファイル。  
styled-componentsの有効化や、環境変数の設定はここで行う。  
```sample.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  }
}

module.exports = nextConfig
```

### styled-componentsの事前設定
SSGのみを使う場合、next.comfig.jsに以下の記述をするだけでよい。  

```sample.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  }
}
```

SSRも使う場合は、↑に加えてpages/_document.tsxに以下の記述が必要。  
```_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () => 
        originalRenderPage({
          enhanceApp: (App) => (props) => 
            sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: [
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ]
      }
    } finally {
      sheet.seal();
    }
  }
}
```