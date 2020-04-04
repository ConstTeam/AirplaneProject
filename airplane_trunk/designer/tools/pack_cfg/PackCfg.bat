cd ./bin
copy /y .\config\Default\cfg ..\..\..\..\project\client\bin\cfg\cfg.bin
Excel2Txt.exe ../../../cfg ./temp
PackConfig.exe ./temp ./config Default
Pause
rd /s /q temp