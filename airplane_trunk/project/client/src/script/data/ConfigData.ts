import ConfigRow from "./ConfigRow";
import ConfigTable from "./ConfigTable";
import Util from "../common/Util";
import EncryptTool from "../common/EncryptTool";

export default class ConfigData
{
	private static _configData: {[key: string]: ConfigTable};
	private static _pos: number;
	private static _bFlag: boolean;
	private static _bFlagEx: boolean;
	private static _valuePos: number;

	public static ParseConfig(buff: ArrayBuffer): void
	{
		this._configData = {};
		var data: Uint8Array = new Uint8Array(buff);
		EncryptTool.Decrypt(data, 20);
		var gunzip = new Zlib.Gunzip(data);
		var plain: Uint8Array = gunzip.decompress();
		var sConfig: string = Util.Utf8ArrayToStr(plain);

		this._valuePos = 0;
		this._pos = 0;
		while(true)
		{
			this._pos = sConfig.indexOf("------@", this._valuePos);
			if(-1 == this._pos)
				break;
			
			this._pos += 7;
			let nPos = sConfig.indexOf('\n', this._pos);
			let cfgName = sConfig.substring(this._pos, nPos);

			try
			{
				let cfgTbl: ConfigTable = new ConfigTable();
				ConfigData._configData[cfgName] = cfgTbl;

				this._pos = nPos + 1;
				nPos = sConfig.indexOf('\n', this._pos);
				this._bFlag = true;
				while(this._bFlag)
				{
					try
					{
						cfgTbl.AddColKey(this.GetNextValue(nPos, sConfig));
					}
					catch(err)
					{
						console.error(cfgName);
					}
				}

				nPos = sConfig.indexOf('\n', this._pos);
				this._bFlag = true;
				this._valuePos = nPos + 1;
				while(this._bFlag)
				{
					let rowName = this.GetNextValue(nPos, sConfig);
					let valueNPos = sConfig.indexOf('\n', this._valuePos);
					let a: number = 0;
					let rowData: ConfigRow = new ConfigRow();
					rowData.AddValue(rowName);
					this._bFlagEx = true;
					while(this._bFlagEx)
					{
						let value = this.GetNextValueEx(valueNPos, sConfig);
						value = value.replace("#r", "\r\n");
						rowData.AddValue(value);
						++a;
					}
					cfgTbl.AddRow(rowName, rowData);
				}
			}
			catch(err)
			{
				console.error(cfgName);
			}
		}
	}

	private static GetNextValue(nPos: number, sConfig: string)
	{
		var tPos = sConfig.indexOf('\t', this._pos);
		if(tPos > nPos || tPos == -1)
		{
			tPos = nPos;
			this._bFlag = false;
		}
		var value:string = sConfig.substring(this._pos, tPos);
		this._pos = tPos + 1;
		return value;
	}

	private static GetNextValueEx(nPos: number, sConfig: string)
	{
		var tPos = sConfig.indexOf('\t', this._valuePos);
		if(tPos > nPos || tPos == -1)
		{
			tPos = nPos;
			this._bFlagEx = false;
		}
		var value:string = sConfig.substring(this._valuePos, tPos);
		this._valuePos = tPos + 1;
		return value;
	}

	public static GetColKeys(sKey: string)
	{
		return this._configData[sKey].m_dicColKeys;
	}

	public static GetTable(sKey: string): ConfigTable
	{
		return this._configData[sKey];
	}

	public static GetRow(sKey1: string, sKey2: string): ConfigRow
	{
		return this.GetTable(sKey1).GetRow(sKey2);
	}

	public static GetValue(sKey1: string, sKey2: string, sKey3: string): string
	{
		return this.GetRow(sKey1, sKey2).GetValue(sKey3);
	}

	public static GetStaticText(sKey: string): string
	{
		return this.GetValue("Lan_StaticText_Client", sKey, "Text");
	}
}