cd ./bin
rd /s /q temp
Excel2Txt.exe ../../../cfg ./temp

PackConfig.exe ./temp ./config Default
copy /y .\config\Default\cfg ..\..\..\..\project\client\Assets\StreamingAssets\UpdatePkg\cfg.ms
copy /y .\config\Default\cfg ..\..\..\game_client\client_Data\StreamingAssets\UpdatePkg\cfg.ms

Pause