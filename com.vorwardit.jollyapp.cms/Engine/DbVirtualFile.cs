using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Hosting;

namespace com.vorwardit.jollyapp.cms.Engine
{
    public class DbVirtualFile : VirtualFile
    {
        private string content { get; set; }

        public DbVirtualFile(string path, string content) : base(path)
        {
            this.content = content;
        }

        public override Stream Open()
        {
            return new MemoryStream(Encoding.UTF8.GetBytes(content));
        }
    }
}