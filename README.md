# Ctrl-H

A structural code search and replace VSCode extension.

![demo](https://github.com/moui66744/ctrl-h/blob/main/demo.gif)

### Application

- find dead code
- find similar code snippets
- code instrumentation
- code equivalent substitution

For specific examples, see [Demo](https://github.com/moui66744/ctrl-h/blob/main/demo.md).

### Grammar

#### Query Language

```
QueryInput ::= Decl | Import | Exp | Stmt
SubQuery ::= (['\\'] QueryInput | '[' INT_VALUE ']' QueryInput)
Decl ::= VarDecl | ClassLikeDecl | MethodDecl
VarDecl ::= {Modifier} [TypeOrVoid] Ident [ '=' Expression ]
Block ::= '{' ((SubQuery {'$' SubQuery} | [SubQuery]) | BlockConstraint) '}'
BlockConstraint ::= '<<null>>' | '<<empty>>'
ClassLikeDecl ::= {Modifier} ClasslikeKeyWord [TypeParameters]
      [EXTENDS TypeList]
      [IMPLEMENTS TypeList]
      [PERMITS TypeList]
			Block
ClasslikeKeyWord ::= 'interface' | 'class' | 'struct'
MethodDecl ::= {Modifier} [TypeOrVoid] Ident '(' [ParamList] ')' [throws Exception] Block 
Stmt ::= IfStmt | Block | ForStmt | TryStmt | SwitchStmt | AssertStmt | WhileStmt | DoWhileStmt
			| ThrowStmt | BreakStmt | ContinueStmt | CaseStmt
Ident ::= '<<>>' | NormalIdent
IfStmt ::= IF ParExp Block [ELSE Block] 
ForStmt ::= FOR '(' ForControl ')' Block
TryStmt ::= TRY Block CATCH (VarDecl)?  [FinalBlock] | FinalBlock
SwitchStmt ::= SWITCH ParExp Block
AssertStmt ::= ASSERT Exp [':' Exp] ';'
WhileStmt ::= WHILE ParExp Block
DoWhileStmt ::= DO Block WHILE ';'
ThrowStmt ::= THROW Exp ';'
BreakStmt ::= BREAK ';'
ContinueStmt ::= CONTINUE ';'
CaseStmt ::= CASE Exp ':' Block
ParExp ::= '('Exp')'
Exp ::= Primary
    | Exp '.'
      (
         Ident
       | MethodCall
       | THIS
       | NEW [NonWildcardTypeArguments] InnerCreator
       | SUPER SuperSuffix
       | ExplicitGenericInvocation
      )
    | Exp '[' Exp ']'
    | MethodCall
    | NEW Creator
    | '(' annotation* typeType {'&' typeType} ')' expression
    | Exp ('++' | '--')
    | ('+'|'-'|'++'|'--') Exp
    | ('~'|'!') Exp
    | Exp ('*'|'/'|'%') Exp
    | Exp ('+'|'-') Exp
    | Exp ('<' '<' | '>' '>' '>' | '>' '>') Exp
    | Exp ('<=' | '>=' | '>' | '<') Exp
    | Exp INSTANCEOF (typeType)
    | Exp ('==' | '!=') Exp
    | Exp '&' Exp
    | Exp '^' Exp
    | Exp '|' Exp
    | Exp '&&' Exp
    | Exp '||' Exp
    | Exp '?' Exp ':' Exp
    | Exp ('=' | '+=' | '-=' | '*=' | '/=' | '&=' | '|=' | '^=' | '>>=' | '>>>=' | '<<=' | '%=') Exp 
Primary
    ::= '(' expression ')'
    | THIS
    | SUPER
    | Literal
    | Identifier
    | TypeTypeOrVoid '.' CLASS
    | NonWildcardTypeArguments (ExplicitGenericInvocationSuffix | THIS Arguments)
ClasslikeKeyWord ::= 'interface' | 'class' | 'struct'
Modifier ::= PUBLIC || PRIVATE ||PROTECTED || STATIC || ABSTRACT || FINAL || VOLATILE || NATIVE
```

#### Replace Language

```
ReplaceInput ::= ReplaceLanguage { }
ReplaceLanguage ::=  [label(,index)?] '=>' (UserString)? '##' [label(,index)?] '##'(UserString)?
UserString ::= '"""'TEXT'"""'
```

