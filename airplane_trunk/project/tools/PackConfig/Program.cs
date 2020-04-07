using ICSharpCode.SharpZipLib.GZip;
using System;
using System.Collections.Generic;
using System.IO;

namespace PackConfig
{
	class Program
	{
		private const int m_iEncryptLen = 20;
		private static List<string> m_CfgNames = new List<string>();
		private static List<string> m_CfgChannels = new List<string>();

		static void Main(string[] args)
		{
			if(args.Length < 3)
			{
				Console.WriteLine("参数错误");
				return;
			}

			string sInputDir = args[0];
			if(!Directory.Exists(sInputDir))
			{
				Console.WriteLine("Input directory doesn`t exist, {0}", sInputDir);
				return;
			}

			
			string[] channels = args[2].Split('|');
			for (int i = 0; i < channels.Length; ++i)
			{
				string sChannel = channels[i];
				m_CfgNames.Clear();
				m_CfgChannels.Clear();
				Console.BackgroundColor = ConsoleColor.Blue;
				Console.Write("----------------------------整合散表----------------------------\n");
				Console.BackgroundColor = ConsoleColor.Black;

				string sOutputPath = string.Format("{0}/{1}", args[1], sChannel);
				if (!Directory.Exists(sOutputPath))
					Directory.CreateDirectory(sOutputPath);

				string sOutputName = string.Format("{0}/cfg.txt", sOutputPath);
				FileStream fsw = File.Open(sOutputName, FileMode.Create);
				StreamWriter sw = new StreamWriter(fsw);
				try
				{
					if(!Excute(sInputDir, sw, sChannel))
						return;
				}
				finally
				{
					sw.Close();
					fsw.Close();
				}

				Compress(sOutputName);

				Console.ForegroundColor = ConsoleColor.Yellow;
				Console.Write(string.Format("使用了Channel:{0}中的\n", sChannel));
				for (int k = 0; k < m_CfgChannels.Count; ++k)
				{
					Console.Write(string.Format("{0}\n", m_CfgChannels[k]));
				}

				Console.ForegroundColor = ConsoleColor.White;
				Console.BackgroundColor = ConsoleColor.Black;
			}
		}

		private static bool Excute(string sInputDir, StreamWriter sw, string sChannel, bool bLanguage = false)
		{
			FileStream fsr = null;
			StreamReader sr = null;
			DirectoryInfo directory = new DirectoryInfo(sInputDir);
			FileInfo[] files = directory.GetFiles();
			for(int i = 0; i < files.Length; ++i)
			{
				Console.ForegroundColor = ConsoleColor.DarkGreen;
				string cfgName = files[i].Name;
				if(-1 != cfgName.IndexOf("_Server"))
					continue;
				if(m_CfgNames.Contains(cfgName))
				{
					m_CfgChannels.Add(cfgName);
					continue;
				}

				Console.Write(cfgName);
				m_CfgNames.Add(cfgName);

				string title = string.Format("------@{0}", cfgName.Replace(".txt", ""));

				int align = 36 - cfgName.Length;
				for(int j = 0; j < align; ++j)
				{
					Console.Write(" ");
				}

				Console.Write("读取...");
				int noUse = 0;
				fsr = files[i].OpenRead();
				sr = new StreamReader(fsr);
				string info = sr.ReadToEnd();

				Console.Write("解析...");
				info = info.Replace("\r", "");
				if("\n" == info.Substring(info.Length - 1))
					info = info.Substring(0, info.Length - 1);

				string[] rowsInfo = info.Split('\n');
                string[] tempRowKey = rowsInfo[1].Split('\t');

				if(rowsInfo.Length < 3)
					continue;

				string[] check = rowsInfo[2].Split('\t');
				int a = tempRowKey.Length;
				for(int j = 1; j < tempRowKey.Length; ++j)
				{
					if("NO_USE" == tempRowKey[j])
						noUse++;
					else
					{
						if("" == tempRowKey[j])
						{
							if("" != check[j])
							{
								Console.BackgroundColor = ConsoleColor.Red;
								Console.ForegroundColor = ConsoleColor.Black;
								Console.Write("\n第{0}列无列名，无法继续，请检查！\n", j + 1);
								Console.BackgroundColor = ConsoleColor.Black;
								Console.ForegroundColor = ConsoleColor.White;
								Console.Write("按任意键退出...");
								Console.ReadKey(true);
								return false;
							}

							Console.ForegroundColor = ConsoleColor.Red;
							Console.Write("\n第{0}列为空列，请从Excel中删除", j + 1);
							Console.ForegroundColor = ConsoleColor.DarkGreen;
							continue;
						}
					}
				}

				string all;
				int step = 0, stepEnd = a;
				string rowKeysLine, values, colKeys;
				if(bLanguage)
				{
					rowKeysLine = string.Empty; values = string.Empty; colKeys = string.Empty;
					step = 0;                       
                    stepEnd = (a - 1 - noUse) / 2 + 1;
					_Excute(rowsInfo, step, stepEnd, tempRowKey, ref colKeys, ref rowKeysLine, ref values);
					all = string.Format("{0}_CN\n{1}\n{2}{3}\n", title, colKeys, rowKeysLine, values);
					Console.Write("写入CN...");
					sw.Write(all);

					rowKeysLine = string.Empty; values = string.Empty; colKeys = string.Empty;
					step = (a - 1 - noUse) / 2 + 1;
                    stepEnd = a;
					_Excute(rowsInfo, step, stepEnd, tempRowKey, ref colKeys, ref rowKeysLine, ref values);
					all = string.Format("{0}_EN\n{1}\n{2}{3}\n", title, colKeys, rowKeysLine, values);
					Console.Write("写入EN...\n");
					sw.Write(all);

					sr.Close();
					fsr.Close();
				}
				else
				{
					rowKeysLine = string.Empty; values = string.Empty; colKeys = string.Empty;
					_Excute(rowsInfo, step, stepEnd, tempRowKey, ref colKeys, ref rowKeysLine, ref values);
					sr.Close();
					fsr.Close();

					all = string.Format("{0}\n{1}\n{2}{3}\n", title, colKeys, rowKeysLine, values);
					Console.Write("写入...\n");
					sw.Write(all);
				}
			}

			DirectoryInfo[] dirs = directory.GetDirectories();
			for(int i = 0; i < dirs.Length; ++i)
			{
				string srcPath = "";
				string dirName = dirs[i].Name;

				if ("Channel" == dirName)
				{
					srcPath = string.Format("{0}/{1}", dirs[i].FullName, sChannel);
					if (!Excute(srcPath, sw, sChannel))
						return false;

					srcPath = string.Format("{0}/{1}", dirs[i].FullName, "Default");
					if (!Excute(srcPath, sw, sChannel))
						return false;
				}
				else if ("Language" == dirName)
				{					
                    srcPath = dirs[i].FullName;
                    if (!Excute(srcPath, sw, sChannel, true))
						return false;
				}
				else
				{
					srcPath = dirs[i].FullName;
					if (!Excute(srcPath, sw, sChannel))
						return false;
				}
			}

			return true;
		}

		private static void _Excute(string[] rowsInfo, int step, int stepEnd, string[] tempRowKey, ref string colKeys, ref string rowKeysLine, ref string values)
		{
			bool bSaveColNames = false;
			string[] temp;
			for(int j = 2; j < rowsInfo.Length; ++j)
			{
				values = string.Format("{0}\n", values);
				temp = rowsInfo[j].Split('\t');

				int b = 0;
				for(int k = 0; k < stepEnd; ++k)
				{
					if(0 == k)
					{
						if("" == temp[k])
						{
							Console.ForegroundColor = ConsoleColor.Red;
							Console.Write("\n第{0}行为空行，请从Excel中删除", j + 2);
							Console.ForegroundColor = ConsoleColor.DarkGreen;
							continue;
						}
						rowKeysLine = "" == rowKeysLine ? temp[k] : string.Format("{0}\t{1}", rowKeysLine, temp[k]);
					}
					if((0 != k && k < step) || tempRowKey[k].Equals("NO_USE")) continue;
					if(!bSaveColNames)
						colKeys = "" == colKeys ? tempRowKey[k] : string.Format("{0}\t{1}", colKeys, tempRowKey[k]);
					if(0 != k)
						values = string.Format((0 == b++ ? "{0}{1}" : "{0}\t{1}"), values, temp[k]);
				}
				bSaveColNames = true;
			}
		}

		private static void Compress(string filePath)
		{
			Console.ForegroundColor = ConsoleColor.White;
			Console.BackgroundColor = ConsoleColor.Blue;
			Console.Write("----------------------------压缩----------------------------\n");
			byte[] data = File.ReadAllBytes(filePath);
			MemoryStream ms = new MemoryStream();
			Stream stream = new GZipOutputStream(ms);
			stream.Write(data, 0, data.Length);
			stream.Close();
			ms.Close();
			byte[] compressedData = ms.ToArray();
			Encrypt(ref compressedData);
			File.WriteAllBytes(filePath.Replace(".txt", ""), compressedData);
		}

		private static void Encrypt(ref byte[] data)
		{
			Console.Write("----------------------------加密----------------------------\n");
			Console.BackgroundColor = ConsoleColor.Black;
			int dataLen = data.Length;
			if (dataLen < 2)
				return;

			int encodeLen = dataLen > m_iEncryptLen * 2 ? m_iEncryptLen : dataLen / 2;

			int f = 0;
			int b = dataLen;
			for(int i = 0; i < 2; i++)
			{
				for(int j = 0; j < encodeLen; j++)
				{
					data[f++] ^= data[--b];
				}
				f -= encodeLen;

				for(int j = 0; j < encodeLen; j++)
				{
					data[b++] ^= data[f++];
				}
				f -= encodeLen;
			}
		}
	}
}
