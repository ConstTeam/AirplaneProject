export default class ConfigRow
{
	private _rowData: Array<string>;
	private _colKeys: {[key: string]: number};

	constructor()
	{
		this._rowData = new Array<string>();
	}

	public SetColKeys(colKeys: {[key: string]: number}): void
	{
		this._colKeys = colKeys;
	}

	public AddValue(value: string): void
	{
		this._rowData.push(value);
	}

	public GetValue(colKey: string): string
	{
		var iVal: number;
		iVal = this._colKeys[colKey]
		if(iVal == null)
			return null;
		
		return this._rowData[iVal];
	}
}