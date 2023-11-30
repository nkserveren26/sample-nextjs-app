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