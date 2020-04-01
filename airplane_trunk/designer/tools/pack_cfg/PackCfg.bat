cd ./bin
rd /s /q temp
Excel2Txt.exe ../../../cfg ./temp

PackConfig.exe ./temp ./config Default
copy /y .\config\Default\cfg ..\..\..\..\project\client\bin\res\config\cfg.ms

Pause