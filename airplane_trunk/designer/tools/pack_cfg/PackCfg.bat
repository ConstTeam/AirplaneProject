cd ./bin
rd /s /q temp
copy /y .\config\Default\cfg ..\..\..\..\project\client\bin\cfg\cfg.bin
Excel2Txt.exe ../../../cfg ./temp
PackConfig.exe ./temp ./config Default
Pause