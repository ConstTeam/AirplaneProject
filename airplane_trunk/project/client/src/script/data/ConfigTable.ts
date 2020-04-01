import ConfigRow from "./ConfigRow";

export default class ConfigTable
{
	public m_Data: {[key: string]: ConfigRow};
	public m_dicColKeys: {[key: string]: number};
	private _iColLength;

	constructor()
	{
		this.m_Data			= {};
		this.m_dicColKeys	= {};
		this._iColLength	= 0;
	}

	public AddRow(rowKey: string, rowData: ConfigRow): void
	{
		rowData.SetColKeys(this.m_dicColKeys);
		this.m_Data[rowKey] = rowData;
	}

	public AddColKey(colKey: string): void
	{
		this.m_dicColKeys[colKey] = this._iColLength;
	}

	public GetValue(rowKey: string, colKey: string)
	{
		var row: ConfigRow = this.m_Data[rowKey];
		if(row == null)
			return null;
		
		return row.GetValue(colKey);
	}

	public GetRow(rowKey: string): ConfigRow
	{
		return this.m_Data[rowKey];
	}

	public HasRow(rowKey: string): boolean
	{
		return this.m_Data[rowKey] != null;
	}
}