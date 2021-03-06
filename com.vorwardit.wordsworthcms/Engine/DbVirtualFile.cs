﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Hosting;

namespace com.vorwardit.wordsworthcms.Engine
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
            var template = Encoding.UTF8
                .GetBytes(this.content);
            var buffer = Encoding.UTF8
                .GetPreamble()
                .Concat(template)
                .ToArray();
            return new MemoryStream(buffer);
        }
    }
}