using System;
using System.Data;
using System.Data.OleDb;
using System.IO;

using Microsoft.Office.Core;
using Excel = Microsoft.Office.Interop.Excel;

namespace Excel2Txt
{
    class Program
    {
        //获得字段最大的实际长度
        static int GetMaxLength(DataTable dt, string captionName)
        {
           DataColumn maxLengthColumn = new DataColumn();
           maxLengthColumn.ColumnName = "MaxLength";
           maxLengthColumn.Expression = String.Format("len(convert({0},'System.String'))", captionName);
           dt.Columns.Add(maxLengthColumn);
           object maxLength = dt.Compute("max(MaxLength)", "true");
           if (maxLength == DBNull.Value)
           {
               return 0;
           }
          
           dt.Columns.Remove(maxLengthColumn);

           return Convert.ToInt32(maxLength);
        }

        static void ConvertExcelToTxt(string inputFile, string outputPath)
        {
			if (Path.GetExtension(inputFile) != ".xls" && Path.GetExtension(inputFile) != ".xlsx")
				return;

			string newFileNameNoExt = Path.GetFileNameWithoutExtension(inputFile);
			string newFileNoExt = outputPath + "\\" + newFileNameNoExt;
			string newFile = newFileNoExt + ".txt";

			Console.ForegroundColor = ConsoleColor.DarkGreen;
			Console.WriteLine(newFileNameNoExt);

            var conn = new OleDbConnection();
            conn.ConnectionString = String.Format(@"Provider=Microsoft.ACE.OLEDB.12.0;" + @"Data Source={0}" + ";Extended Properties=\"Excel 12.0 Xml;HDR=No;IMEX=1\"", inputFile);
            conn.Open();
            DataTable sheetTb = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
            DataRow sheet  = sheetTb.Rows[0];
			string tableName = sheet["TABLE_NAME"].ToString();
			string sql = String.Format("select * from [{0}]", tableName);
			OleDbDataAdapter da = new OleDbDataAdapter(sql, conn);

			var ds = new DataSet();
			da.Fill(ds);
			var tb1 = ds.Tables[0];

			FileStream fs = new FileStream(newFileNoExt + ".txt", FileMode.OpenOrCreate);
			StreamWriter sw = new StreamWriter(fs);

			int[] colMaxLen = new int[tb1.Columns.Count];
			foreach (DataRow row in tb1.Rows)
			{
				for (int j = 0; j < tb1.Columns.Count; ++j)
				{
					DataColumn col = tb1.Columns[j];
					string content = row[j].ToString();
					bool fFlag = -1 != content.IndexOf("\r") || -1 != content.IndexOf("\n");
					string fmt = String.Format("{0}{1}0{2}{3}{4}", fFlag ? "\"" : "", "{", "}", fFlag ? "\"" : "", j + 1 == tb1.Columns.Count ? "" : "\t");
					sw.Write(fmt, row[j]);
				}
				sw.WriteLine();
			}
			sw.Close();
		}

        static void Excute(string inputDir, string outDir)
        {
			if (!Directory.Exists(outDir))
				Directory.CreateDirectory(outDir);

            DirectoryInfo di = new DirectoryInfo(inputDir);
            FileInfo[] files = di.GetFiles();
			foreach (FileInfo file in files)
            {
                string srcPath = file.FullName;
                string dstPath = outDir;
				ConvertExcelToTxt(srcPath, dstPath);
			}

			DirectoryInfo[] infos = di.GetDirectories();
			foreach (DirectoryInfo info in infos)
            {
                string srcPath = info.FullName;
                string dstPath = outDir + "\\" + info.Name;
                Excute(srcPath, dstPath);
            }
        }

        static void Main(string[] args)
        {
            if(args.Length < 2)
            {
                Console.WriteLine("参数错误");
                return;
            }

            string inputDir = args[0];
            if (!Directory.Exists(inputDir))
            {
                Console.WriteLine("Input directory dosen`t exist, {0}", inputDir);
                return;
            }

			Console.BackgroundColor = ConsoleColor.Blue;
			Console.Write("----------------------------Excel转Txt----------------------------\n");
			Console.BackgroundColor = ConsoleColor.Black;

			Excute(inputDir, args[1]);

			Console.ForegroundColor = ConsoleColor.White;
			Console.BackgroundColor = ConsoleColor.Black;
        }
    }
}
