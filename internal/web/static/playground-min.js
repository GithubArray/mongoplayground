function indent(t){return format(t,!0,!0)}function compact(t){return format(t,!1,!0)}function compactAndRemoveComment(t){return format(t,!1,!1)}function format(t,n,r){t.endsWith(";")&&(t=t.slice(0,-1));var a="",s=!1,p=!1,i=0,e=0;for(t.startsWith("db.")&&(e=t.indexOf("(")+1,a+=t.substring(0,e));e<t.length;){var o=t.charAt(e);if(o===" "||o===`
`||o==="	"){e++;continue}switch(s&&o!=="]"&&o!=="}"&&(s=!1,i++,a+=n?newline(i):""),o){case"(":p=!0,a+=o;break;case")":p=!1,a+=o;break;case"{":case"[":s=!0,a+=o;break;case",":a+=o,n&&(p?a+=" ":a+=newline(i));break;case":":a+=o,n&&(a+=" ");break;case"}":case"]":s?s=!1:(i--,a+=n?newline(i):""),a+=o;break;case'"':case"'":var u=o;for(a+='"',e++,o=t.charAt(e);o!==u&&e<t.length;)a+=o,e++,o=t.charAt(e);e!=t.length&&(a+='"');break;case"n":if(t.length>=e+9&&t.substring(e,e+9)==="new Date("){for(a+="new Date(",e+="new Date(".length,o=t.charAt(e);o!==")"&&e<t.length;)a+=o,e++,o=t.charAt(e);e!=t.length&&(a+=")")}else a+=o;break;case"/":if(t.length>=e+1&&t.charAt(e+1)=="/"){if(!r){for(e+=2;o!=`
`&&e<t.length;)e++,o=t.charAt(e);continue}for(a+="/**",e+=2,o=t.charAt(e);o!=`
`&&e<t.length;)a+=o,e++,o=t.charAt(e);a+="*/",n&&(a+=newline(i))}else if(t.length>=e+2&&t.charAt(e+1)=="*"&&t.charAt(e+2)=="*"){if(start=e+3,e=t.indexOf("*/",start),!r){e==-1?(e=start,t.charAt(e)=="/"&&e++):e+=2;continue}if(e==-1){e=start,t.charAt(e)=="/"&&e++;continue}comment=t.substring(start,e),a+="/**",n?(comment=comment.replace(/[\s]+\*/gm,"*").trimRight(),comment=comment.replace(/\*/gm,newline(i)+"*"),comment.indexOf("*")>0&&(comment+=newline(i)),a+=comment):a+=comment.replace(/[\s]+\*/gm,"*").trimRight(),a+="*/",e++,n&&(a+=newline(i))}else if(t.length>=e+1&&t.charAt(e+1)=="*"){if(start=e+2,e=t.indexOf("*/",start),!r){e==-1?e=start:e+=2;continue}if(e==-1){e=start;continue}comment=t.substring(start,e),a+="/**",n?(comment=comment.replace(/[\s]*\n[\s]+/gm,"* ").trimRight(),comment=comment.replace(/\*/gm,newline(i)+"*"),comment.indexOf("*")>0&&(comment+=newline(i)),a+=comment):a+=comment.replace(/[\s]*\n[\s]+/gm,"* ").trimRight(),a+="*/",e++,n&&(a+=newline(i))}else{for(a+=o,e++,o=t.charAt(e);o!=="/"&&e<t.length;)a+=o,e++,o=t.charAt(e);e!=t.length&&(a+="/")}break;default:a+=o}e++}return a}function newline(t){for(var n=`
`,r=0;r<t;r++)n+="  ";return n}function isConfigValid(t,n){var r=compactAndRemoveComment(t);return r.startsWith("[")&&r.endsWith("]")?!0:n==="bson"?/^\s*db\s*=\s*\{[\s\S]*\}$/.test(r):!1}function isQueryValid(t){t.endsWith(";")&&(t=t.slice(0,-1));var n=t.indexOf(".explain(");if(n!=-1){var r=t.indexOf(")",n);if(r!=-1){var a=t.substring(n,r+1);t=t.replace(a,"")}}var s=compactAndRemoveComment(t),p=/^db\..(\w*)\.(find|aggregate|update)\([\s\S]*\)$/.test(s);if(!p)return!1;var i=s.indexOf("(")+1;return t=s.substring(i,s.length-1),!(t!==""&&!t.endsWith("}")&&!t.endsWith("]"))}var templates=[{config:'[{"key":1},{"key":2}]',query:"db.collection.find()",mode:"bson"},{config:'db={"orders":[{"_id":1,"item":"almonds","price":12,"quantity":2},{"_id":2,"item":"pecans","price":20,"quantity":1},{"_id":3}],"inventory":[{"_id":1,"sku":"almonds","description":"product 1","instock":120},{"_id":2,"sku":"bread","description":"product 2","instock":80},{"_id":3,"sku":"cashews","description":"product 3","instock":60},{"_id":4,"sku":"pecans","description":"product 4","instock":70},{"_id":5,"sku":null,"description":"Incomplete"},{"_id":6}]}',query:'db.orders.aggregate([{"$lookup":{"from":"inventory","localField":"item","foreignField":"sku","as":"inventory_docs"}}])',mode:"bson"},{config:'[{"collection":"collection","count":10,"content":{"key":{"type":"int","minInt":0,"maxInt":10}}}]',query:"db.collection.find()",mode:"mgodatagen"},{config:'[{"key":1},{"key":2}]',query:'db.collection.update({"key":2},{"$set":{"updated":true}},{"multi":false,"upsert":false})',mode:"bson"},{config:'[{"collection":"collection","count":5,"content":{"description":{"type":"fromArray","in":["Coffee and cakes","Gourmet hamburgers","Just coffee","Discount clothing","Indonesian goods"]}},"indexes":[{"name":"description_text_idx","key":{"description":"text"}}]}]',query:'db.collection.find({"$text":{"$search":"coffee"}})',mode:"mgodatagen"},{config:'[{"_id":1,"item":"ABC","price":80,"sizes":["S","M","L"]},{"_id":2,"item":"EFG","price":120,"sizes":[]},{"_id":3,"item":"IJK","price":160,"sizes":"M"},{"_id":4,"item":"LMN","price":10},{"_id":5,"item":"XYZ","price":5.75,"sizes":null}]',query:'db.collection.aggregate([{"$unwind":{"path":"$sizes","preserveNullAndEmptyArrays":true}},{"$group":{"_id":"$sizes","averagePrice":{"$avg":"$price"}}},{"$sort":{"averagePrice":-1}}]).explain("executionStats")',mode:"bson"}],configWordCompleter={getCompletions:function(t,n,r,a,s){var p=n.getTokenAt(r.row,r.column);s(null,basicBsonSnippet.map(function(i){return{caption:i.caption,value:i.value,meta:i.meta,completer:{insertMatch:function(e,o){e.removeWordLeft();var u="";p.value.startsWith('"')||(u='"'),p.value.endsWith('"')&&e.removeWordRight(),e.insert(u+o.value.replace(":",'":'))}}}}))}},queryWordCompleter={getCompletions:function(t,n,r,a,s){var p=n.getTokenAt(r.row,r.column),i=n.getTokens(r.row);if(i.length>3&&i[0].value==="db"&&i[p.index-1].value==="."){s(null,methodSnippet);return}else if(i.length===3&&i[0].value==="db"&&i[p.index-1].value==="."){s(null,availableCollections);return}var e=basicBsonSnippet;t.getSession().getLine(0).includes(".find(")?e=e.concat(querySnippet):t.getSession().getLine(0).includes(".aggregate(")?e=e.concat(aggregationSnippet):e=e.concat(updateSnippet),s(null,e.map(function(o){return{caption:o.caption,value:o.value,meta:o.meta,completer:{insertMatch:function(u,c){u.removeWordLeft();var g="";p.value.startsWith('"')||(g='"'),p.value.endsWith('"')&&u.removeWordRight(),u.insert(g+c.value.replace(":",'":'))}}}}))}};function updateAvailableCollection(t,n){if(availableCollections=[],t.startsWith("[")&&n=="bson"){addDefaultCollection();return}if(t.startsWith("[")&&n=="mgodatagen"){for(var r of t.split(`
`))if(!!r.startsWith('    "collection')){var a=r.indexOf(":");if(!(a==-1||a+1>=r.length)){var s=r.substring(a+1,r.length).trim().replace(/[\",]/g,"");availableCollections.push({caption:s,value:s,meta:"collection name"})}}availableCollections.length==0&&addDefaultCollection();return}for(r of t.split(`
`))if(!!r.startsWith('  "')){var a=r.indexOf(":");if(a!=-1){var s=r.substring(2,a-1).replace(/\"/g,"");availableCollections.push({caption:s,value:s,meta:"collection name"})}}availableCollections.length==0&&addDefaultCollection()}function addDefaultCollection(){availableCollections.push({caption:"collection",value:"collection",meta:"collection name"})}var methodSnippet=[{caption:"find()",value:"find()",meta:"method"},{caption:"aggregate()",value:"aggregate()",meta:"method"},{caption:"update()",value:"update()",meta:"method"},{caption:"explain()",value:"explain()",meta:"method"}],availableCollections=[{caption:"collection",value:"collection",meta:"collection name"}],basicBsonSnippet=[{caption:"true",value:"true",meta:"bson keyword"},{caption:"false",value:"false",meta:"bson keyword"},{caption:"null",value:"null",meta:"bson keyword"},{caption:"$numberDecimal",value:"$numberDecimal: ",meta:"bson keyword"},{caption:"$numberDouble",value:"$numberDouble: ",meta:"bson keyword"},{caption:"$numberLong",value:"$numberLong: ",meta:"bson keyword"},{caption:"$numberInt",value:"$numberLong: ",meta:"bson keyword"},{caption:"$oid",value:"$oid: ",meta:"bson keyword"},{caption:"$regularExpression",value:`$regularExpression: {
 "pattern": "pattern",
 "options": "options"
}`,meta:"bson keyword"},{caption:"$timestamp",value:'$timestamp: {"t": 0, "i": 1}',meta:"bson keyword"},{caption:"$date",value:"$date: ",meta:"bson keyword"}],querySnippet=[{caption:"$eq",value:'$eq: "value"',meta:"comparison operator"},{caption:"$gt",value:'$gt: "value"',meta:"comparison operator"},{caption:"$gte",value:'$gte: "value"',meta:"comparison operator"},{caption:"$in",value:'$in: ["value1", "value2"]',meta:"comparison operator"},{caption:"$let",value:`$let: {
 "vars": { "var": "expression" },
 "in": "expression"
}`,meta:"variable operator"},{caption:"$lt",value:'$lt: "value"',meta:"comparison operator"},{caption:"$lte",value:'$lte: "value"',meta:"comparison operator"},{caption:"$ne",value:'$ne: "value"',meta:"comparison operator"},{caption:"$nin",value:'$nin: ["value1", "value2"',meta:"comparison operator"},{caption:"$not",value:"$not: { }",meta:"logical operator"},{caption:"$nor",value:'$nor: [ { "expression1" }, { "expression2" } ]',meta:"logical operator"},{caption:"$and",value:'$and: [ { "expression1" }, { "expression2" } ]',meta:"logical operator"},{caption:"$or",value:'$or: [ { "expression1" }, { "expression2" } ]',meta:"logical operator"},{caption:"$exists",value:'$exists: "value"',meta:"element operator"},{caption:"$type",value:'$type: "bson type"',meta:"element operator"},{caption:"$expr",value:'$expr: { "expression" }',meta:"evaluation operator"},{caption:"$jsonSchema",value:'$jsonSchema: { "schema" }',meta:"evaluation operator"},{caption:"$mod",value:'$mod: [ "divisor", "remainder" ]',meta:"evaluation operator"},{caption:"$regex",value:'$regex: "pattern"',meta:"evaluation operator"},{caption:"$where",value:'$where: "code"',meta:"evaluation operator"},{caption:"$geoIntersects",value:`$geoIntersects: {
 "$geometry": {
  "type": "GeoJSON type",
  "coordinates": [  ]
 }
}`,meta:"geospatial operator"},{caption:"$geoWithin",value:`$geoWithin: {
 "$geometry": {
  "type": "Polygon",
  "coordinates": [  ]
 }
}`,meta:"geospatial operator"},{caption:"$near",value:`$near: {
 "$geometry": {
  "type": "Point",
  "coordinates": [ "long", "lat" ]
 }, "$maxDistance": 10, "$minDistance": 1
}`,meta:"geospatial operator"},{caption:"$nearSphere",value:`$nearSphere: {
 "$geometry": {
  "type": "Point",
  "coordinates": [ "long", "lat" ]
 }, "$maxDistance": 10, "$minDistance": 1
}`,meta:"geospatial operator"},{caption:"$box",value:"$box:  [ [ 0, 0 ], [ 100, 100 ] ]",meta:"geospatial operator"},{caption:"$center",value:'$center: [ [ "x", "y" ] , "radius" ]',meta:"geospatial operator"},{caption:"$centerSphere",value:'$centerSphere: [ [ "x", "y" ] , "radius" ]',meta:"geospatial operator"},{caption:"$geometry",value:`$geometry: {
 "type": "Polygon",
 "coordinates": [ ]
}`,meta:"geospatial operator"},{caption:"$maxDistance",value:"$maxDistance: 10",meta:"geospatial operator"},{caption:"$minDistance",value:"$minDistance: 10",meta:"geospatial operator"},{caption:"$polygon",value:"$polygon: [ [ 0 , 0 ], [ 3 , 6 ], [ 6 , 0 ] ]",meta:"geospatial operator"},{caption:"$all",value:'$all: [ "value1" , "value2" ]',meta:"array operator"},{caption:"$elemMatch",value:'$elemMatch: { "query1", "query2" }',meta:"array operator"},{caption:"$size",value:"$size: 1",meta:"array operator"},{caption:"$bitsAllClear",value:'$bitsAllClear: [ "pos1", "pos2" ]',meta:"bitwise operator"},{caption:"$bitsAllSet",value:'$bitsAllSet: [ "pos1", "pos2" ]',meta:"bitwise operator"},{caption:"$bitsAnyClear",value:'$bitsAnyClear: [ "pos1", "pos2" ]',meta:"bitwise operator"},{caption:"$bitsAnySet",value:'$bitsAnySet: [ "pos1", "pos2" ]',meta:"bitwise operator"},{caption:"$slice",value:"$slice: 2",meta:"projection operator"}],aggregationSnippet=[{caption:"$abs",value:"$abs: -1",meta:"arithmetic operator"},{caption:"$accumulator",value:`$accumulator: {
 "init": "code",
 "initArgs": "array expression",
 "accumulate": "code",
 "accumulateArgs": "array expression",
 "merge": "code",
 "finalize": "code",
 "lang": "string"
}`,meta:"accumulation operator"},{caption:"$acos",value:'$acos: "expression"',meta:"trigonometry operator"},{caption:"$acosh",value:'$acosh: "expression"',meta:"trigonometry operator"},{caption:"$add",value:'$add: [ "expression1", "expression2" ]',meta:"arithmetic operator"},{caption:"$addFields",value:'$addFields: { "newField": "expression" }',meta:"aggregation stage"},{caption:"$addToSet",value:'$addToSet: "expression"',meta:"accumulation operator"},{caption:"$allElementsTrue",value:'$allElementsTrue: [ "expression" ]',meta:"set operator"},{caption:"$and",value:'$and: [ "expression1", "expression2" ]',meta:"boolean operator"},{caption:"$anyElementTrue",value:'$anyElementTrue: [ "expression" ]',meta:"set operator"},{caption:"$arrayElemAt",value:'$arrayElemAt: [ "array", "idx" ]',meta:"array operator"},{caption:"$arrayToObject",value:'$arrayToObject: "expression"',meta:"array operator"},{caption:"$asin",value:'$asin: "expression"',meta:"trigonometry operator"},{caption:"$asinh",value:'$asinh: "expression"',meta:"trigonometry operator"},{caption:"$atan",value:'$atan: "expression"',meta:"trigonometry operator"},{caption:"$atan2",value:'$atan2: [ "expression 1", "expression 2" ]',meta:"trigonometry operator"},{caption:"$atanh",value:'$atanh: "expression"',meta:"trigonometry operator"},{caption:"$avg",value:'$avg: "expression"',meta:"accumulation operator"},{caption:"$binarySize",value:'$binarySize: "string or binData"',meta:"size operator"},{caption:"$bsonSize",value:'$bsonSize: "object"',meta:"size operator"},{caption:"$bucket",value:`$bucket: {
 "groupBy": "expression",
 "boundaries": [ "lowerbound1", "lowerbound2" ],
 "default": "literal",
 "output": {
  "output1": "$accumulator expression",
  "outputN": "$accumulator expression"
 }
}`,meta:"aggregation stage"},{caption:"$bucketAuto",value:`$bucketAuto: {
 "groupBy": "expression",
 "buckets": 2,
 "output": {
 "output1": "$accumulator expression"},
 "granularity": "string"
}`,meta:"aggregation stage"},{caption:"$ceil",value:"$ceil: 3.3",meta:"arithmetic operator"},{caption:"$cmp",value:'$cmp: [ "expression1", "expression2" ]',meta:"comparison operator"},{caption:"$concat",value:'$concat: [ "expression1", "expression2" ]',meta:"string operator"},{caption:"$concatArrays",value:'$concatArrays: [ "array1", "array2" ]',meta:"array operator"},{caption:"$cond",value:`$cond: {
 "if": "boolean-expression",
 "then": "true-case",
 "else": "false-case" }`,meta:"conditional operator"},{caption:"$convert",value:`$convert: {
 "input": "expression",
 "to": "type expression",
 "onError": "expression",
 "onNull": "expression"
}`,meta:"type operator"},{caption:"$cos",value:'$cos: "expression"',meta:"trigonometry operator"},{caption:"$count",value:'$count: "string"',meta:"aggregation stage"},{caption:"$dateFromParts",value:`$dateFromParts : {
 "year": "year", "month": "month", "day": "day",
 "hour": "hour", "minute": "minute", "second": "second",
 "millisecond": "ms", "timezone": "tzExpression"
}`,meta:"date operator"},{caption:"$dateFromString",value:`$dateFromString: {
 "dateString": "dateStringExpression",
 "format": "formatStringExpression",
 "timezone": "tzExpression",
 "onError": "onErrorExpression",
 "onNull": "onNullExpression"
}`,meta:"string operator"},{caption:"$dateToParts",value:`$dateToParts: {
 "date" : "dateExpression",
 "timezone" : "timezone",
 "iso8601" : "boolean"
}`,meta:"date operator"},{caption:"$dateToString",value:`$dateToString: {
 "date": "dateExpression",
 "format": "formatString",
 "timezone": "tzExpression",
 "onNull": "expression"
}`,meta:"string operator"},{caption:"$dayOfMonth",value:'$dayOfMonth: "dateExpression"',meta:"date operator"},{caption:"$dayOfWeek",value:'$dayOfWeek: "dateExpression"',meta:"date operator"},{caption:"$dayOfYear",value:'$dayOfYear: "dateExpression"',meta:"date operator"},{caption:"$degreesToRadians",value:'$degreesToRadians: "expression"',meta:"trigonometry operator"},{caption:"$divide",value:'$divide: [ "expression1", "expression2" ]',meta:"arithmetic operator"},{caption:"$eq",value:'$eq: [ "expression1", "expression2" ]',meta:"comparison operator"},{caption:"$exists",value:"$exists: true",meta:"aggregation operator"},{caption:"$exp",value:'$exp: "exponent"',meta:"arithmetic operator"},{caption:"$facet",value:`$facet:
{
 "outputField1": [ "stage1", "stage2" ]
}`,meta:"aggregation stage"},{caption:"$filter",value:'$filter: { "input": "array", "as": "string", "cond": "expression" }',meta:"array operator"},{caption:"$first",value:'$first: "expression"',meta:"array operator"},{caption:"$floor",value:"$floor: 1",meta:"arithmetic operator"},{caption:"$function",value:`$function: {
 "body": "code",
 "args": "array expression",
 "lang": "js"
}`,meta:"aggregation operator"},{caption:"$geoNear",value:'$geoNear: { "TODO" }',meta:"aggregation stage"},{caption:"$graphLookup",value:`$graphLookup: {
 "from": "collection",
 "startWith": "expression",
 "connectFromField": "string",
 "connectToField": "string",
 "as": "string",
 "maxDepth": 2,
 "depthField": "string",
 "restrictSearchWithMatch": "document"
}`,meta:"aggregation stage"},{caption:"$group",value:`$group: {
 "_id": "group by expression",
 "field": { "accumulator" : "expression" }
}`,meta:"aggregation stage"},{caption:"$gt",value:'$gt: [ "expression1", "expression2" ]',meta:"comparison operator"},{caption:"$gte",value:'$gte: [ "expression1", "expression2" ]',meta:"comparison operator"},{caption:"$hour",value:'$hour: "dateExpression"',meta:"date operator"},{caption:"$ifNull",value:'$ifNull: [ "expression", "replacement-expression-if-null" ]',meta:"conditional operator"},{caption:"$in",value:'$in: [ "expression", "array expression" ]',meta:"array operator"},{caption:"$indexOfArray",value:'$indexOfArray: [ "array expression", "search expression", "start", "end" ]',meta:"array operator"},{caption:"$indexOfBytes",value:'$indexOfBytes: [ "string expression", "substring expression", "start", "end" ]',meta:"string operator"},{caption:"$indexOfCP",value:'$indexOfCP: [ "string expression", "substring expression", "start", "end" ]',meta:"string operator"},{caption:"$isArray",value:'$isArray: [ "expression" ]',meta:"array operator"},{caption:"$isNumber",value:'$isNumber: "expression"',meta:"type operator"},{caption:"$isoDayOfWeek",value:'$isoDayOfWeek: "dateExpression"',meta:"date operator"},{caption:"$isoWeek",value:'$isoWeek: "dateExpression"',meta:"date operator"},{caption:"$isoWeekYear",value:'$isoWeekYear: "dateExpression"',meta:"date operator"},{caption:"$last",value:'$last: "expression"',meta:"array operator"},{caption:"$limit",value:'$limit: "positive integer"',meta:"aggregation stage"},{caption:"$ln",value:"$ln: 10",meta:"arithmetic operator"},{caption:"$log",value:"$log: [ 100, 10 ]",meta:"arithmetic operator"},{caption:"$log10",value:"$log10: 4",meta:"arithmetic operator"},{caption:"$lookup",value:`$lookup: {
 "from": "collection to join",
 "localField": "field from the input documents",
 "foreignField": "field from the documents of the from collection",
 "as": "output array field"
}`,meta:"aggregation stage"},{caption:"$lt",value:'$lt: [ "expression1", "expression2" ]',meta:"comparison operator"},{caption:"$lte",value:'$lte: [ "expression1", "expression2" ]',meta:"comparison operator"},{caption:"$ltrim",value:'$ltrim: { "input": "string",  "chars": "string" }',meta:"string operator"},{caption:"$map",value:'$map: { "input": "expression", "as": "string", "in": "expression" }',meta:"array operator"},{caption:"$match",value:"$match: { }",meta:"aggregation stage"},{caption:"$max",value:'$max: "expression"',meta:"accumulation operator"},{caption:"$merge",value:`$merge: {
 "into": "collection",
 "on": "identifier field",
 "let": "variables",
 "whenMatched": "replace|keepExisting|merge|fail|pipeline",
 "whenNotMatched": "insert|discard|fail"
}`,meta:"aggregation stage"},{caption:"$mergeObjects",value:'$mergeObjects: "document"',meta:"object operator"},{caption:"$millisecond",value:'$millisecond: "dateExpression"',meta:"date operator"},{caption:"$min",value:'$min: "expression"',meta:"accumulation operator"},{caption:"$minute",value:'$minute: "dateExpression"',meta:"date operator"},{caption:"$mod",value:'$mod: [ "expression1", "expression2" ]',meta:"arithmetic operator"},{caption:"$month",value:'$month: "dateExpression"',meta:"date operator"},{caption:"$multiply",value:'$multiply: [ "expression1", "expression2" ]',meta:"arithmetic operator"},{caption:"$ne",value:'$ne: [ "expression1", "expression2" ]',meta:"comparison operator"},{caption:"$not",value:'$not: [ "expression" ]',meta:"boolean operator"},{caption:"$objectToArray",value:'$objectToArray: "object"',meta:"object operator"},{caption:"$or",value:'$or: [ "expression1", "expression2" ]',meta:"boolean operator"},{caption:"$out",value:'$out: { "db": "output-db", "coll": "output-collection" }',meta:"aggregation stage"},{caption:"$pow",value:'$pow: [ "number", "exponent" ]',meta:"arithmetic operator"},{caption:"$project",value:"$project: { }",meta:"aggregation stage"},{caption:"$push",value:'$push: "expression"',meta:"accumulation operator"},{caption:"$radiansToDegrees",value:'$radiansToDegrees: "expression"',meta:"trigonometry operator"},{caption:"$range",value:'$range: [ "start", "end", "non-zero step" ]',meta:"array operator"},{caption:"$redact",value:'$redact: "expression"',meta:"aggregation stage"},{caption:"$reduce",value:'$reduce: { "input": "array", "initialValue": "expression", "in": "expression" }',meta:"array operator"},{caption:"$regexFind",value:'$regexFind: { "input": "expression", "regex": "expression", "options": "expression" }',meta:"string operator"},{caption:"$regexFindAll",value:'$regexFindAll: { "input": "expression", "regex": "expression", "options": "expression" }',meta:"string operator"},{caption:"$regexMatch",value:'$regexMatch: { "input": "expression" , "regex": "expression", "options": "expression" }',meta:"string operator"},{caption:"$replaceAll",value:'$replaceAll: { "input": "expression", "find": "expression", "replacement": "expression" }',meta:"string operator"},{caption:"$replaceOne",value:'$replaceOne: { "input": "expression", "find": "expression", "replacement": "expression" }',meta:"string operator"},{caption:"$replaceRoot",value:'$replaceRoot: { "newRoot": "replacementDocument" }',meta:"aggregation stage"},{caption:"$replaceWith",value:'$replaceWith: "replacementDocument"',meta:"aggregation stage"},{caption:"$reverseArray",value:'$reverseArray: "array expression"',meta:"array operator"},{caption:"$round",value:'$round : [ "number", "place" ]',meta:"arithmetic operator"},{caption:"$rtrim",value:'$rtrim: { "input": "string", chars: "string" }',meta:"string operator"},{caption:"$sample",value:'$sample: { "size": "positive integer" }',meta:"aggregation stage"},{caption:"$second",value:'$second: "dateExpression"',meta:"date operator"},{caption:"$set",value:'$set: { "newField": "expression" }',meta:"aggregation stage"},{caption:"$setDifference",value:'$setDifference: [ "expression1", "expression2" ]',meta:"set operator"},{caption:"$setEquals",value:'$setEquals: [ "expression1", "expression2" ]',meta:"set operator"},{caption:"$setIntersection",value:'$setIntersection: [ "array1", "array2" ]',meta:"set operator"},{caption:"$setIsSubset",value:'$setIsSubset: [ "expression1", "expression2" ]',meta:"set operator"},{caption:"$setUnion",value:'$setUnion: [ "expression1", "expression2" ]',meta:"set operator"},{caption:"$sin",value:'$sin: "expression"',meta:"trigonometry operator"},{caption:"$size",value:'$size: "expression"',meta:"array operator"},{caption:"$skip",value:"$skip",meta:"aggregation stage"},{caption:"$slice",value:'$slice: [ "array", "n" ]',meta:"array operator"},{caption:"$sort:",value:"$sort: { }",meta:"aggregation stage"},{caption:"$sortByCount",value:'$sortByCount:  "expression"',meta:"aggregation stage"},{caption:"$split",value:'$split: [ "string expression", "delimiter" ]',meta:"string operator"},{caption:"$sqrt",value:"$sqrt: 12",meta:"arithmetic operator"},{caption:"$stdDevPop",value:'$stdDevPop: "expression"',meta:"accumulation operator"},{caption:"$stdDevSamp",value:'$stdDevSamp: "expression"',meta:"accumulation operator"},{caption:"$strLenBytes",value:'$strLenBytes: "string expression"',meta:"string operator"},{caption:"$strLenCP",value:'$strLenCP: "string expression"',meta:"string operator"},{caption:"$strcasecmp",value:'$strcasecmp: [ "expression1", "expression2" ]',meta:"string operator"},{caption:"$substr",value:'$substr: [ "string", "start", "length" ]',meta:"string operator"},{caption:"$substrBytes",value:'$substrBytes: [ "string expression", "byte index", "byte count" ]',meta:"string operator"},{caption:"$substrCP",value:'$substrCP: [ "string expression", "code point index", "code point count" ]',meta:"string operator"},{caption:"$subtract",value:'$subtract: [ "expression1", "expression2" ]',meta:"arithmetic operator"},{caption:"$sum",value:'$sum: "expression"',meta:"accumulation operator"},{caption:"$switch",value:`$switch: {
 "branches": [
 { "case": "expression", "then": "expression" } 
]
}`,meta:"conditional operator"},{caption:"$tan",value:'$tan: "expression"',meta:"trigonometry operator"},{caption:"$toBool",value:'$toBool: "expression"',meta:"type operator"},{caption:"$toDate",value:'$toDate: "expression"',meta:"type operator"},{caption:"$toDecimal",value:'$toDecimal: "expression"',meta:"type operator"},{caption:"$toDouble",value:'$toDouble: "expression"',meta:"type operator"},{caption:"$toInt",value:'$toInt: "expression"',meta:"type operator"},{caption:"$toLong",value:'$toLong: "expression"',meta:"type operator"},{caption:"$toLower",value:'$toLower: "expression"',meta:"string operator"},{caption:"$toObjectId",value:'$toObjectId: "expression"',meta:"type operator"},{caption:"$toString",value:'$toString: "expression"',meta:"type operator"},{caption:"$toUpper",value:'$toUpper: "expression"',meta:"string operator"},{caption:"$trim",value:'$trim: { "input": "string",  "chars": "string" }',meta:"string operator"},{caption:"$trunc",value:'$trunc : [ "number", "place" ]',meta:"arithmetic operator"},{caption:"$type",value:'$type: "expression"',meta:"type operator"},{caption:"$unionWith",value:'$unionWith: { "coll": "collection", "pipeline": [ "stage1" ] }',meta:"aggregation stage"},{caption:"$unset",value:'$unset: "field"',meta:"aggregation stage"},{caption:"$unwind",value:'$unwind: "field path"',meta:"aggregation stage"},{caption:"$week",value:'$week: "dateExpression"',meta:"date operator"},{caption:"$where",value:'$where: "code"',meta:"aggregation operator"},{caption:"$year",value:'$year: "dateExpression"',meta:"date operator"},{caption:"$zip",value:`$zip: {
 "inputs": [ "array expression1" ],
 "useLongestLength": "boolean",
 "defaults":  "array expression"
}`,meta:"array operator"}],updateSnippet=[{caption:"$currentDate",value:'$currentDate: "expression"',meta:"update operator"},{caption:"$inc",value:'$inc: { "field": 1 }',meta:"update operator"},{caption:"$min",value:'$min: "expression"',meta:"update operator"},{caption:"$max",value:'$max: "expression"',meta:"update operator"},{caption:"$mul",value:'$mul: { "field": 2 }',meta:"update operator"},{caption:"$rename",value:'$rename: { "field": "newName" }',meta:"update operator"},{caption:"$set",value:'$set: { "field": "value" }',meta:"update operator"},{caption:"$setOnInsert",value:'$setOnInsert: { "field": "value" }',meta:"update operator"},{caption:"$unset",value:'$unset: { "field": "" }',meta:"update operator"},{caption:"$addToSet",value:'$addToSet: "expression"',meta:"update operator"},{caption:"$pop",value:'$pop: "expression"',meta:"update operator"},{caption:"$pull",value:'$pull: "expression"',meta:"update operator"},{caption:"$push",value:'$push: "expression"',meta:"update operator"},{caption:"$pullAll",value:'$pullAll: { "field": ["value1", "value2"] }',meta:"update operator"},{caption:"$each",value:'$each: ["value1", "value2"]',meta:"update operator"},{caption:"$position",value:"$position: 0",meta:"update operator"},{caption:"$slice",value:"$slice: 2",meta:"update operator"},{caption:"$sort",value:'$sort: "expression"',meta:"update operator"},{caption:"$bit",value:'$bit: { "field": { "and|or|xor": 4} }',meta:"update operator"}],CustomSelect=function(t){var n=document.getElementById(t.elem),r="js-Dropdown",a="js-Dropdown-title",s="js-Dropdown-list",p="is-selected",i="is-open",e=n.options,o=e.length,u=0,c=document.createElement("div");c.className=r,c.id="custom-"+n.id;var g=document.createElement("button");g.className=a,g.textContent=e[0].textContent;var d=document.createElement("ul");d.className=s,f(e),c.appendChild(g),c.appendChild(d),c.addEventListener("click",h),n.parentNode.insertBefore(c,n),n.style.display="none";function f(m){for(var l=0;l<m.length;l++){var $=document.createElement("li");$.innerText=m[l].textContent,$.setAttribute("data-value",m[l].value),$.setAttribute("data-index",u++),e[n.selectedIndex].textContent===m[l].textContent&&($.classList.add(p),g.textContent=m[l].textContent),d.appendChild($)}}document.addEventListener("click",function(m){c.contains(m.target)||v()});function h(m){m.preventDefault();var l=m.target;if(l.className===a&&x(),l.tagName==="LI"){c.querySelector("."+a).innerText=l.innerText,n.options.selectedIndex=l.getAttribute("data-index"),n.dispatchEvent(new CustomEvent("change"));for(var $=0;$<o;$++)d.querySelectorAll("li")[$].classList.remove(p);l.classList.add(p),v()}}function x(){d.classList.toggle(i)}function y(){d.classList.add(i)}function v(){d.classList.remove(i)}function b(){return c.querySelector("."+a).innerText}return{toggle:x,close:v,open:y,getValue:b}};
