# 学習メモ

## npm install
### --save-devオプション
ローカルインストールのオプション。  
このオプションをつけてnpm installを実行すると、カレントディレクトリにnode_modulesディレクトリが作られ、そこにパッケージがインストールされる。  
また、package.jsonのdevDependenciesにインストールしたパッケージが記載される。  
devDependenciesに記載のパッケージは、以下のコマンド実行時にインストールされない。  
　npm install --production


なので、開発環境でのみ使うパッケージは、--save-devオプションをつけてインストールすることが多い。  
また、--saveオプションをつけてインストールを実行した場合はdependenciesに追加される。  
　→本番環境で必要なパッケージはこっちのオプションでインストールする。

<br>

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

<br>

## next.config.js
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

<br>

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

<br>

## ESLint
JavaScriptやTypeScriptなどの静的解析ツール。  
ESlintを導入することで、単純な構文エラーやプロジェクト固有のコーディング規約を定義することができる。  
厳密なルールを定義することで、複数人で開発する場合でもシステム全体のコードの一貫性を維持することができる。  

コードのチェックはnext lintコマンドで実行される。  
　オプション無しの場合、pages, components, lib以下のファイルが対象となる。  
　--dirオプションでディレクトリを指定すると、そのディレクトリ配下の全ファイルが対象となる。

実際に使う時は、package.jsonにlintコマンドの定義を記載する。  
```sample.json
{
  "name": "sample-next-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --dir src"
  },
  ...
}
```

lintコマンドを実行するとコードチェックが実行され、ソースコードの問題が列挙される。  
これらの問題を修正するには、以下のコマンドを実行する。  
　next lint --fix --dir src  

package.jsonでエイリアスを定義して使うことも可能。  
```sample.json
{
  "name": "sample-next-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --dir src",
    "format": "next lint --fix --dir src"
  },
  ...
}
```

lintコマンドの実行で以下のエラーが出た場合  
```
Failed to load config "prettier" to extend from.
```

eslint-config-prettierライブラリが存在しないことが原因なので、これをインストールする。  
```
npm install --save-dev eslint-config-prettier
```

<br>

## Prettier
コードの自動整形を行うツール。  
主にコードのスタイルを統一し、可読性を向上させるために使用される。  
（文字列はダブルクォートで記載する、など）  
Prettierは異なる開発者やチームが異なるスタイルでコードを書くことを避け、一貫性を持ったコードベースを維持するのに役立つ。  
ESLintと役割が被っているように見えるが、両者の使い方としては以下のようになると考える。  
　コードの規則をチェックしてバグを拾う→ESLint
　フォーマットを整える→Prettier

## as const（const アサーション）
全ての値を読み取り専用（変更不可）にするアサーション。  
ネストしたオブジェクトも読み取り専用となる。  

```sample.ts
import colors from "./colors";
import fontSizes from "./fontSizes";
import letterSpacings from "./letterSpacings";
import lineHeights from "./lineHeights";
import space from "./space";

export const theme = {
    space,
    fontSizes,
    letterSpacings,
    lineHeights,
    colors
} as const
```

constアサーションしたオブジェクトや配列に対して、各プロパティ（配列の場合は各要素）の値を変更しようとするとエラーになる。  