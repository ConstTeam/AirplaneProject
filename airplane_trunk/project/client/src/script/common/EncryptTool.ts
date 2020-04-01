export default class EncryptTool
{
	public static Decrypt(data: Uint8Array, encryptLen: number, beginPos: number = 0):void
	{
		var dataLen: number = data.length;
		if(dataLen < beginPos + 2)
			return;

		var encodeLen: number = dataLen > encryptLen * 2 ? encryptLen : (dataLen - beginPos) / 2;
		var f = beginPos;
		var b = dataLen - encodeLen;
		for(let i: number = 0; i < 2; ++i)
		{
			for(let j: number = 0; j < encodeLen; ++j)
			{
				data[b++] ^= data[f++];
			}
			f -= encodeLen;

			for(let j: number = 0; j < encodeLen; ++j)
			{
				data[f++] ^= data[--b];
			}
			f -= encodeLen;
		}
	}
}