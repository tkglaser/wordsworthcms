using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.vorwardit.wordsworthcms.Engine
{
    public static class DbPathProviderSingleton
    {
        private static DbPathProvider mInstance = null;

        public static DbPathProvider Instance
        {
            get
            {
                if (mInstance == null)
                {
                    mInstance = new DbPathProvider();
                }
                return mInstance;
            }
        }
    }
}