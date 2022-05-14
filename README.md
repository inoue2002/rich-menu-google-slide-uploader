# rich-menu-google-slide-uploader
GoogleSlideをそのままリッチメニューにしちゃうスクリプト

# How to use
GoogleSlideのページ設定を行うことで、LINEBotのリッチメニューに対応した画像を簡単に生成することができます。
[サンプルファイル](https://docs.google.com/presentation/d/1PKTUr4GauL7V9-vDSk5oHRXLUkZ9-nDpXZ4V-9tpRz8/edit?usp=sharing)

ページ設定を以下のように行ってください
`カスタム 66.15 x 44.69 cm`

![スクリーンショット 2022-05-14 13 11 20](https://user-images.githubusercontent.com/54356188/168410248-a149d2bb-cb0c-4575-b538-0c2de4134c95.png)


作成したGoogleSlideのファイルIDを取得（ex:https://docs.google.com/presentation/d/${presentationId}/edit#slide=id.xxxxxxx）
LINEBotを作成しアクセストークンを取得
Slideを画像に変える時に保存するフォルダーを作成&フォルダーIDを取得
`index.gs`をGoogleAppsScriptに貼り付け、環境変数の上記3つを書き換えた上、main関数を起動してセットアップを行う
