# wms-unique-holds

OCLC does not currently publish a reconciliation report of new items placed on
hold (the [Daily Holds Ready for Pickup][holds-ready] report is a cumulative
list). We'll need to keep a list of previously added items to diff out the new
from the old. This uses [LevelDB][level] to store a list of hashed [ND-JSON][ndj]
objects and only passes unique items through.

## usage

```
unique-holds [/path/to/leveldb]
```

Pipe a stream of ND-JSON objects

```
$ unique-holds < holds-list-20160229.txt > new-holds-20160229.txt
```

Note: you'll have to do this once to prime the db with items to ignore.


## license

MIT

[holds-ready]: https://www.oclc.org/support/worldshare-management-services/sites/www.oclc.org.support.worldshare-management-services/files/FTP_Reconciliation_Reports.pdf#10
[level]: http://leveldb.org/
[ndj]: http://ndjson.org
